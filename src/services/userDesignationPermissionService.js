const UserDesignationPermission = require('../models/UserDesignationPermission');
const UserDesignation = require('../models/UserDesignation');
const Permission = require('../models/Permission');

const getAllUserDesignationPermissions = async (page, limit) => {
  const skip = (page - 1) * limit;

  const designationPermissions = await UserDesignationPermission.find()
    .populate('userDesignationId', 'designationName description')
    .populate('permissions', 'permissionName permissionDescription')
    .populate('createdBy', 'username')
    .populate('updatedBy', 'username')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await UserDesignationPermission.countDocuments();

  return {
    designationPermissions,
    pagination: {
      current: page,
      pages: Math.ceil(total / limit),
      total,
      limit
    }
  };
};

const getUserDesignationPermissionById = async (id) => {
  return UserDesignationPermission.findById(id)
    .populate('userDesignationId', 'designationName description')
    .populate('permissions', 'permissionName permissionDescription')
    .populate('createdBy', 'username')
    .populate('updatedBy', 'username');
};

const createUserDesignationPermission = async (data, createdBy) => {
  const { userDesignationId, permissions } = data;

  // Validate designation exists
  const designation = await UserDesignation.findById(userDesignationId);
  if (!designation) {
    throw new Error('User designation not found');
  }

  // Validate all permissions exist
  const validPermissions = await Permission.find({ '_id': { $in: permissions } });
  if (validPermissions.length !== permissions.length) {
    throw new Error('One or more permissions are invalid');
  }

  // Check if designation permission already exists
  const existing = await UserDesignationPermission.findOne({ userDesignationId });
  if (existing) {
    throw new Error('Permissions for this designation already exist');
  }

  const designationPermission = await UserDesignationPermission.create({
    userDesignationId,
    permissions,
    createdBy
  });

  return UserDesignationPermission.findById(designationPermission._id)
    .populate('userDesignationId', 'designationName description')
    .populate('permissions', 'permissionName permissionDescription')
    .populate('createdBy', 'username');
};

const updateUserDesignationPermission = async (id, data, updatedBy) => {
  const { permissions } = data;

  // Validate all permissions exist if provided
  if (permissions) {
    const validPermissions = await Permission.find({ '_id': { $in: permissions } });
    if (validPermissions.length !== permissions.length) {
      throw new Error('One or more permissions are invalid');
    }
  }

  const designationPermission = await UserDesignationPermission.findByIdAndUpdate(
    id,
    { permissions, updatedBy },
    { new: true, runValidators: true }
  );

  if (!designationPermission) {
    throw new Error('User designation permission not found');
  }

  return UserDesignationPermission.findById(designationPermission._id)
    .populate('userDesignationId', 'designationName description')
    .populate('permissions', 'permissionName permissionDescription')
    .populate('createdBy', 'username')
    .populate('updatedBy', 'username');
};

const deleteUserDesignationPermission = async (id, deletedBy) => {
  const designationPermission = await UserDesignationPermission.findByIdAndDelete(id);
  
  if (!designationPermission) {
    throw new Error('User designation permission not found');
  }

  return designationPermission;
};

module.exports = {
  getAllUserDesignationPermissions,
  getUserDesignationPermissionById,
  createUserDesignationPermission,
  updateUserDesignationPermission,
  deleteUserDesignationPermission
};