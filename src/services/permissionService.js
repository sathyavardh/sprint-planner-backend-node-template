const Permission = require('../models/Permission');

const getAllPermissions = async (page, limit, search) => {
  const skip = (page - 1) * limit;
  
  const filter = search ? {
    $or: [
      { permissionName: { $regex: search, $options: 'i' } },
      { permissionDescription: { $regex: search, $options: 'i' } }
    ]
  } : {};

  const permissions = await Permission.find(filter)
    .populate('createdBy', 'username')
    .populate('updatedBy', 'username')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Permission.countDocuments(filter);

  return {
    permissions,
    pagination: {
      current: page,
      pages: Math.ceil(total / limit),
      total,
      limit
    }
  };
};

const getPermissionById = async (id) => {
  return Permission.findById(id)
    .populate('createdBy', 'username')
    .populate('updatedBy', 'username');
};

const createPermission = async (permissionData, createdBy) => {
  const permission = await Permission.create({
    ...permissionData,
    createdBy
  });

  return Permission.findById(permission._id)
    .populate('createdBy', 'username');
};

const updatePermission = async (id, permissionData, updatedBy) => {
  const permission = await Permission.findByIdAndUpdate(
    id,
    { ...permissionData, updatedBy },
    { new: true, runValidators: true }
  );

  if (!permission) {
    throw new Error('Permission not found');
  }

  return Permission.findById(permission._id)
    .populate('createdBy', 'username')
    .populate('updatedBy', 'username');
};

const deletePermission = async (id, deletedBy) => {
  const permission = await Permission.findByIdAndDelete(id);
  
  if (!permission) {
    throw new Error('Permission not found');
  }

  return permission;
};

module.exports = {
  getAllPermissions,
  getPermissionById,
  createPermission,
  updatePermission,
  deletePermission
};