const UserDesignation = require('../models/UserDesignation');
const UserDesignationPermission = require('../models/UserDesignationPermission');

const getAllUserDesignations = async (page, limit) => {
  const skip = (page - 1) * limit;

  const designations = await UserDesignation.find()
    .populate('createdBy', 'username')
    .populate('updatedBy', 'username')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await UserDesignation.countDocuments();

  return {
    designations,
    pagination: {
      current: page,
      pages: Math.ceil(total / limit),
      total,
      limit
    }
  };
};

const getUserDesignationById = async (id) => {
  return UserDesignation.findById(id)
    .populate('createdBy', 'username')
    .populate('updatedBy', 'username');
};

const createUserDesignation = async (designationData, createdBy) => {
  console.log('Creating user designation:', designationData);
  
  // Extract permissions from the payload
  const { permissions, ...designationInfo } = designationData;
  
  // Create the user designation first
  const designation = await UserDesignation.create({
    ...designationInfo,
    createdBy
  });

  // If permissions are provided, create user designation permissions
  if (permissions && Array.isArray(permissions) && permissions.length > 0) {
    const permissionPromises = permissions.map(permissionId => 
      UserDesignationPermission.create({
        userDesignationId: designation._id,
        permissions: permissionId,
        createdBy
      })
    );
    
    await Promise.all(permissionPromises);
  }

  return UserDesignation.findById(designation._id)
    .populate('createdBy', 'username');
};

const updateUserDesignation = async (id, designationData, updatedBy) => {
  // Extract permissions from the payload
  const { permissions, ...designationInfo } = designationData;
  
  // Update the user designation
  const designation = await UserDesignation.findByIdAndUpdate(
    id,
    { ...designationInfo, updatedBy },
    { new: true, runValidators: true }
  );

  if (!designation) {
    throw new Error('User designation not found');
  }

  // If permissions are provided, update user designation permissions
  if (permissions && Array.isArray(permissions)) {
    // Delete existing permissions for this designation
    await UserDesignationPermission.deleteMany({ userDesignationId: id });
    
    // Create new permissions
    if (permissions.length > 0) {
      const permissionPromises = permissions.map(permissionId => 
        UserDesignationPermission.create({
          userDesignationId: id,
          permissions: permissionId,
          createdBy: updatedBy
        })
      );
      
      await Promise.all(permissionPromises);
    }
  }

  return UserDesignation.findById(designation._id)
    .populate('createdBy', 'username')
    .populate('updatedBy', 'username');
};

const deleteUserDesignation = async (id, deletedBy) => {
  const designation = await UserDesignation.findByIdAndDelete(id);
  
  if (!designation) {
    throw new Error('User designation not found');
  }

  // Delete associated permissions
  await UserDesignationPermission.deleteMany({ userDesignationId: id });

  return designation;
};

// Helper function to get designation with permissions
const getUserDesignationWithPermissions = async (id) => {
  const designation = await UserDesignation.findById(id)
    .populate('createdBy', 'username')
    .populate('updatedBy', 'username');
    
  if (!designation) {
    return null;
  }

  const permissions = await UserDesignationPermission.find({ userDesignationId: id })
    .populate('permissions', 'name description');

  return {
    ...designation.toObject(),
    permissions: permissions.map(p => p.permissions)
  };
};

module.exports = {
  getAllUserDesignations,
  getUserDesignationById,
  getUserDesignationWithPermissions,
  createUserDesignation,
  updateUserDesignation,
  deleteUserDesignation
};