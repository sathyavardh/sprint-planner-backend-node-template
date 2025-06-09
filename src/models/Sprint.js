const mongoose = require('mongoose');

const sprintSchema = new mongoose.Schema({
  sprintStartDate: {
    type: Date,
    required: true
  },
  sprintEndDate: {
    type: Date,
    required: true
  },
  allTaskIds: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Task',
    default: [] // ✅ Optional and initialized as empty array
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

module.exports = mongoose.model('Sprint', sprintSchema);
