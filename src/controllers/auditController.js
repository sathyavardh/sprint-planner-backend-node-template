const auditService = require('../services/auditService');

const getAudits = async (req, res) => {
  const { page = 1, limit = 10, entityType, entityId } = req.query;
  const result = await auditService.getAllAudits(parseInt(page), parseInt(limit), entityType, entityId);
  
  res.json({
    message: 'Audit logs retrieved successfully',
    data: result.audits,
    pagination: result.pagination
  });
};

const getAudit = async (req, res) => {
  const audit = await auditService.getAuditById(req.params.id);
  
  if (!audit) {
    return res.status(404).json({ message: 'Audit log not found' });
  }
  
  res.json({
    message: 'Audit log retrieved successfully',
    data: audit
  });
};

module.exports = {
  getAudits,
  getAudit
};