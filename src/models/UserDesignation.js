const mongoose = require('mongoose');
const { DESIGNATIONS } = require('../config/constants');

const userDesignationSchema = new mongoose.Schema({
  designationName: {
    type: String,
    required: true,
    unique: true,
    enum: Object.values(DESIGNATIONS)
  },
  description: {
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

module.exports = mongoose.model('UserDesignation', userDesignationSchema);