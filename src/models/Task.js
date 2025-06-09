const mongoose = require('mongoose');
const { TASK_TAGS, TASK_LEVELS, TASK_STATUS } = require('../config/constants');

const taskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sprintId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sprint',
    required: true
  },
  taskName: String,
  taskDescription: String,
  taskTags: {
    type: [String],
    enum: TASK_TAGS
  },
  taskLevel: {
    type: String,
    enum: TASK_LEVELS
  },
  taskStatus: {
    type: String,
    enum: TASK_STATUS,
    default: 'Not yet started'
  },
  taskStartDate: Date,
  taskEndDate: Date,
  assign: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }
  ],
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

module.exports = mongoose.model('Task', taskSchema);
