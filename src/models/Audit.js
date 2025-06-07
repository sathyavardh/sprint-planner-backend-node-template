const mongoose = require('mongoose');
const { AUDIT_ACTIONS } = require('../config/constants');

const auditSchema = new mongoose.Schema({
  entityType: {
    type: String,
    required: true,
    trim: true
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: Object.values(AUDIT_ACTIONS)
  },
  previousData: {
    type: mongoose.Schema.Types.Mixed
  },
  newData: {
    type: mongoose.Schema.Types.Mixed
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

auditSchema.index({ entityType: 1, entityId: 1 });
auditSchema.index({ performedBy: 1 });
auditSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Audit', auditSchema);
