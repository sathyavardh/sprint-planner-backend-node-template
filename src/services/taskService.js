const Task = require("../models/Task");
const Sprint = require("../models/Sprint");
const User = require("../models/User");

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

  // Update each assigned user's taskInvolved field
  const assignedUsers = task.assign?.map((a) => a.userId) || [];

  if (assignedUsers.length > 0) {
    await User.updateMany(
      { _id: { $in: assignedUsers } },
      { $addToSet: { taskInvolved: task._id } } // use $addToSet to prevent duplicates
    );
  }

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
  // Step 1: Fetch the original task to compare status change
  const existingTask = await Task.findById(id);
  if (!existingTask) throw new Error("Task not found");

  // Step 2: Update the task
  const updatedTask = await Task.findByIdAndUpdate(
    id,
    { ...taskData, updatedBy },
    { new: true, runValidators: true }
  ).populate("userId", "username");

  // Step 3: Check if task status changed to "Completed"
  if (
    taskData.taskStatus === "Completed" &&
    existingTask.taskStatus !== "Completed"
  ) {
    const assignedUserIds = updatedTask.assign?.map(u => u.userId) || [];

    if (assignedUserIds.length > 0) {
      await User.updateMany(
        { _id: { $in: assignedUserIds } },
        {
          $addToSet: { taskCompleted: updatedTask._id },
          $pull: { taskInvolved: updatedTask._id }
        }
      );
    }
  }

  return updatedTask;
};

const deleteTask = async (id) => {
  // Step 1: Find and delete the task
  const task = await Task.findByIdAndDelete(id);
  if (!task) throw new Error("Task not found");

  // Step 2: Remove taskId from the sprint's allTaskIds
  await Sprint.updateOne(
    { _id: task.sprintId },
    { $pull: { allTaskIds: task._id } }
  );

  // Step 3: Remove taskId from user's taskInvolved and taskCompleted
  const assignedUserIds = task.assign?.map(a => a.userId) || [];

  if (assignedUserIds.length > 0) {
    await User.updateMany(
      { _id: { $in: assignedUserIds } },
      {
        $pull: {
          taskInvolved: task._id,
          taskCompleted: task._id
        }
      }
    );
  }

  return task;
};


module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
