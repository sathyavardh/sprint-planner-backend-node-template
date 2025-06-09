const taskService = require('../services/taskService');

const createTask = async (req, res) => {
  try {
    req.previousData = null;
    const task = await taskService.createTask(req.body, req.user._id);

    res.status(201).json({
      message: 'Task created and linked to current sprint successfully',
      data: task
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to create task',
      error: error.message
    });
  }
};

const getTasks = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const result = await taskService.getAllTasks(parseInt(page), parseInt(limit));

  res.json({
    message: 'Tasks retrieved successfully',
    data: result.tasks,
    pagination: result.pagination
  });
};

const getTask = async (req, res) => {
  const task = await taskService.getTaskById(req.params.id);

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  res.json({
    message: 'Task retrieved successfully',
    data: task
  });
};

const updateTask = async (req, res) => {
  try {
    const task = await taskService.updateTask(req.params.id, req.body, req.user._id);

    res.json({
      message: 'Task updated successfully',
      data: task
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update task',
      error: error.message
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    await taskService.deleteTask(req.params.id);

    res.json({
      message: 'Task deleted and unlinked from sprint'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete task',
      error: error.message
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask
};
