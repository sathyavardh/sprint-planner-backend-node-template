const Audit = require('../models/Audit');
const { AUDIT_ACTIONS } = require('../config/constants');

const createAuditLog = async (entityType, entityId, action, previousData, newData, performedBy) => {
  try {
    await Audit.create({
      entityType,
      entityId,
      action,
      previousData,
      newData,
      performedBy
    });
  } catch (error) {
    console.error('Audit log creation failed:', error);
  }
};

const auditMiddleware = (entityType) => {
  return async (req, res, next) => {
    const originalSend = res.send;
    
    res.send = function(data) {
      // Only audit successful operations
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const method = req.method;
        let action;
        
        switch (method) {
          case 'POST':
            action = AUDIT_ACTIONS.CREATE;
            break;
          case 'PUT':
          case 'PATCH':
            action = AUDIT_ACTIONS.UPDATE;
            break;
          case 'DELETE':
            action = AUDIT_ACTIONS.DELETE;
            break;
          default:
            return originalSend.call(this, data);
        }

        // Create audit log
        setImmediate(async () => {
          try {
            const responseData = typeof data === 'string' ? JSON.parse(data) : data;
            const entityId = req.params.id || responseData.data?._id || responseData._id;
            
            if (entityId && req.user) {
              await createAuditLog(
                entityType,
                entityId,
                action,
                req.previousData || null,
                responseData.data || responseData,
                req.user._id
              );
            }
          } catch (error) {
            console.error('Audit logging error:', error);
          }
        });
      }
      
      originalSend.call(this, data);
    };
    
    next();
  };
};

module.exports = { createAuditLog, auditMiddleware };