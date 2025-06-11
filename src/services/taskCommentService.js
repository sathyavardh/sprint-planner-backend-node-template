// taskCommentService.js
const TaskComment = require("../models/TaskComment");
const Task = require("../models/Task");

const createTaskComment = async (data, createdBy) => {
  // Check if the user is assigned to the task
  const task = await Task.findById(data.taskId);
  if (!task) throw new Error("Task not found");

  const isUserAssigned = task.assign.some(
    (assignee) => assignee.userId.toString() === data.userId
  );

  if (!isUserAssigned) throw new Error("User is not assigned to this task");

  const newComment = await TaskComment.create({
    ...data,
    createdBy
  });

  return newComment.populate("userId", "username");
};

const getAllComments = async (taskId) => {
  return TaskComment.find({ taskId })
    .populate("userId", "username")
    .sort({ commentedAt: -1 });
};

const getCommentById = async (id) => {
  return TaskComment.findById(id).populate("userId", "username");
};

const updateComment = async (id, data, updatedBy) => {
  const existingComment = await TaskComment.findById(id);
  if (!existingComment) throw new Error("Comment not found");

  const task = await Task.findById(existingComment.taskId);
  if (!task) throw new Error("Task not found");

  const isUserAssigned = task.assign.some(
    (assignee) => assignee.userId.toString() === data.userId
  );

  if (!isUserAssigned) throw new Error("User is not assigned to this task");

  const updated = await TaskComment.findByIdAndUpdate(
    id,
    { ...data, updatedBy },
    { new: true, runValidators: true }
  ).populate("userId", "username");

  return updated;
};

const deleteComment = async (id) => {
  return TaskComment.findByIdAndDelete(id);
};

module.exports = {
  createTaskComment,
  getAllComments,
  getCommentById,
  updateComment,
  deleteComment
};
