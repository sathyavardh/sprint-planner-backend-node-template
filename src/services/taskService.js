const Task = require("../models/Task");
const Sprint = require("../models/Sprint");

const createTask = async (taskData, createdBy) => {
  console.log("Creating task:", taskData);

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0); // Ensure UTC 00:00:00
  console.log("Today UTC:", today.toISOString());

  // Find current active sprint
  let currentSprint = await Sprint.findOne({
    sprintStartDate: { $lte: today },
    sprintEndDate: { $gte: today },
  });

  console.log("Current Sprint:", currentSprint);

  if (!currentSprint) {
    throw new Error("No active sprint found for today");
  }

  // Create the task and associate to the sprint
  const task = await Task.create({
    ...taskData,
    sprintId: currentSprint._id,
    createdBy,
  });

  // Push task ID into sprint's allTaskIds
  currentSprint.allTaskIds.push(task._id);
  await currentSprint.save();

  return Task.findById(task._id)
    .populate("createdBy", "username")
    .populate("sprintId", "sprintStartDate sprintEndDate");
};

const getAllTasks = async (page, limit) => {
  const skip = (page - 1) * limit;

  const tasks = await Task.find()
    .populate("userId", "username")
    .populate("sprintId", "sprintStartDate sprintEndDate")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Task.countDocuments();

  return {
    tasks,
    pagination: {
      current: page,
      pages: Math.ceil(total / limit),
      total,
      limit,
    },
  };
};

const getTaskById = async (id) => {
  return Task.findById(id)
    .populate("userId", "username")
    .populate("sprintId", "sprintStartDate sprintEndDate");
};

const updateTask = async (id, taskData, updatedBy) => {
  const task = await Task.findByIdAndUpdate(
    id,
    { ...taskData, updatedBy },
    { new: true, runValidators: true }
  );

  if (!task) throw new Error("Task not found");

  return Task.findById(task._id).populate("userId", "username");
};

const deleteTask = async (id) => {
  const task = await Task.findByIdAndDelete(id);
  if (!task) throw new Error("Task not found");

  await Sprint.updateOne(
    { _id: task.sprintId },
    { $pull: { allTaskIds: task._id } }
  );

  return task;
};

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
};

