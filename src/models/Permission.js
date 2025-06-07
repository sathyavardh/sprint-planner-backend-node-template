const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
  permissionName: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  permissionDescription: {
    type: String,
    required: true,
    trim: true
  },
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

module.exports = mongoose.model('Permission', permissionSchema);