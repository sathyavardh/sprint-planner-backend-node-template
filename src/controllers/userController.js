//Handles business logic and request processing
const userService = require('../services/userService');

const getUsers = async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;
  const result = await userService.getAllUsers(parseInt(page), parseInt(limit), search);
  
  res.json({
    message: 'Users retrieved successfully',
    data: result.users,
    pagination: result.pagination
  });
};

const getUser = async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  res.json({
    message: 'User retrieved successfully',
    data: user
  });
};

const createUser = async (req, res) => {
  req.previousData = null; // For audit
  const user = await userService.createUser(req.body, req.user._id);
  
  res.status(201).json({
    message: 'User created successfully',
    data: user
  });
};

const updateUser = async (req, res) => {
  const previousUser = await userService.getUserById(req.params.id);
  req.previousData = previousUser?.toObject(); // For audit
  
  const user = await userService.updateUser(req.params.id, req.body, req.user._id);
  
  res.json({
    message: 'User updated successfully',
    data: user
  });
};

const deleteUser = async (req, res) => {
  await userService.deleteUser(req.params.id, req.user._id);
  
  res.json({
    message: 'User deleted successfully'
  });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
};