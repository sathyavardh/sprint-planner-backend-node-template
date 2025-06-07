//Contains business logic separated from controllers

const User = require('../models/User');
const UserDesignation = require('../models/UserDesignation');

const getAllUsers = async (page, limit, search) => {
  const skip = (page - 1) * limit;
  
  const filter = search ? {
    $or: [
      { username: { $regex: search, $options: 'i' } },
      { userEmail: { $regex: search, $options: 'i' } },
      { userCompany: { $regex: search, $options: 'i' } }
    ]
  } : {};

  const users = await User.find(filter)
    .populate('userDesignation', 'designationName description')
    .populate('createdBy', 'username')
    .populate('updatedBy', 'username')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await User.countDocuments(filter);

  return {
    users,
    pagination: {
      current: page,
      pages: Math.ceil(total / limit),
      total,
      limit
    }
  };
};

const getUserById = async (id) => {
  return User.findById(id)
    .populate('userDesignation', 'designationName description')
    .populate('createdBy', 'username')
    .populate('updatedBy', 'username');
};

const createUser = async (userData, createdBy) => {
  // Validate designation exists
  const designation = await UserDesignation.findById(userData.userDesignation);
  if (!designation) {
    throw new Error('Invalid designation');
  }

  const user = await User.create({
    ...userData,
    createdBy
  });

  return User.findById(user._id)
    .populate('userDesignation', 'designationName description')
    .populate('createdBy', 'username');
};

const updateUser = async (id, userData, updatedBy) => {
  // Validate designation if provided
  if (userData.userDesignation) {
    const designation = await UserDesignation.findById(userData.userDesignation);
    if (!designation) {
      throw new Error('Invalid designation');
    }
  }

  const user = await User.findByIdAndUpdate(
    id,
    { ...userData, updatedBy },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new Error('User not found');
  }

  return User.findById(user._id)
    .populate('userDesignation', 'designationName description')
    .populate('createdBy', 'username')
    .populate('updatedBy', 'username');
};

const deleteUser = async (id, deletedBy) => {
  const user = await User.findByIdAndDelete(id);
  
  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};