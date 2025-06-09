const mongoose = require('mongoose');

const userDesignationPermissionSchema = new mongoose.Schema({
  userDesignationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserDesignation',
    required: true,
    unique: true
  },
  permissions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Permission'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

userDesignationPermissionSchema.index({ userDesignationId: 1 }, { unique: true });

module.exports = mongoose.model('UserDesignationPermission', userDesignationPermissionSchema);
