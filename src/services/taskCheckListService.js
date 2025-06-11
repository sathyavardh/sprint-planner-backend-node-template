const TaskCheckList = require('../models/TaskCheckList');
const Task = require('../models/Task');

const isUserAssigned = async (taskId, userId) => {
  const task = await Task.findById(taskId);
  if (!task) throw new Error("Task not found");
  const assignedIds = task.assign.map(u => u.userId.toString());
  return assignedIds.includes(userId.toString());
};

const createChecklist = async (data, createdBy) => {
  const allowed = await isUserAssigned(data.taskId, createdBy);
  if (!allowed) throw new Error("You are not assigned to this task");

  return TaskCheckList.create({ ...data, createdBy });
};

const getChecklistById = async (id) => {
  return TaskCheckList.findById(id).populate('createdBy', 'username');
};

const getAllChecklists = async (taskId) => {
  return TaskCheckList.find({ taskId }).populate('createdBy', 'username');
};

const updateChecklist = async (id, data, updatedBy) => {
  const checklist = await TaskCheckList.findById(id);
  if (!checklist) throw new Error("Checklist not found");

  const allowed = await isUserAssigned(checklist.taskId, updatedBy);
  if (!allowed) throw new Error("You are not assigned to this task");

  checklist.checklist = data.checklist;
  checklist.updatedBy = updatedBy;
  checklist.updatedAt = new Date();
  await checklist.save();
  return checklist;
};

const deleteChecklist = async (id) => {
  const checklist = await TaskCheckList.findByIdAndDelete(id);
  if (!checklist) throw new Error("Checklist not found");
  return checklist;
};

module.exports = {
  createChecklist,
  getChecklistById,
  getAllChecklists,
  updateChecklist,
  deleteChecklist
};
