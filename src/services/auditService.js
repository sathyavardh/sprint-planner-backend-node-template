const Audit = require('../models/Audit');

const getAllAudits = async (page, limit, entityType, entityId) => {
  const skip = (page - 1) * limit;
  
  const filter = {};
  if (entityType) filter.entityType = entityType;
  if (entityId) filter.entityId = entityId;

  const audits = await Audit.find(filter)
    .populate('performedBy', 'username userEmail')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Audit.countDocuments(filter);

  return {
    audits,
    pagination: {
      current: page,
      pages: Math.ceil(total / limit),
      total,
      limit
    }
  };
};

const getAuditById = async (id) => {
  return Audit.findById(id)
    .populate('performedBy', 'username userEmail');
};

module.exports = {
  getAllAudits,
  getAuditById
};