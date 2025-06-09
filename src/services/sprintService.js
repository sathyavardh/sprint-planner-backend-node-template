const Sprint = require('../models/Sprint');
const Task = require('../models/Task');

const getAllSprints = async (page, limit) => {
  const skip = (page - 1) * limit;

  const sprints = await Sprint.find()
    .populate('createdBy', 'username')
    .populate('updatedBy', 'username')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Sprint.countDocuments();

  return {
    sprints,
    pagination: {
      current: page,
      pages: Math.ceil(total / limit),
      total,
      limit
    }
  };
};

const getSprintById = async (id) => {
  return Sprint.findById(id)
    .populate('createdBy', 'username')
    .populate('updatedBy', 'username')
    .populate('allTaskIds', 'taskName taskStatus');
};

const createSprint = async (sprintData, createdBy) => {
  const sprint = await Sprint.create({
    ...sprintData,
    createdBy
  });

  return Sprint.findById(sprint._id)
    .populate('createdBy', 'username');
};

const updateSprint = async (id, sprintData, updatedBy) => {
  const sprint = await Sprint.findByIdAndUpdate(
    id,
    { ...sprintData, updatedBy },
    { new: true, runValidators: true }
  );

  if (!sprint) {
    throw new Error('Sprint not found');
  }

  return Sprint.findById(sprint._id)
    .populate('createdBy', 'username')
    .populate('updatedBy', 'username');
};

const deleteSprint = async (id) => {
  const sprint = await Sprint.findByIdAndDelete(id);

  if (!sprint) {
    throw new Error('Sprint not found');
  }

  return sprint;
};

module.exports = {
  getAllSprints,
  getSprintById,
  createSprint,
  updateSprint,
  deleteSprint
};
