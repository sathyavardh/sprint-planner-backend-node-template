const userDesignationPermissionService = require('../services/userDesignationPermissionService');

const getUserDesignationPermissions = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const result = await userDesignationPermissionService.getAllUserDesignationPermissions(parseInt(page), parseInt(limit));
  
  res.json({
    message: 'User designation permissions retrieved successfully',
    data: result.designationPermissions,
    pagination: result.pagination
  });
};

const getUserDesignationPermission = async (req, res) => {
  const designationPermission = await userDesignationPermissionService.getUserDesignationPermissionById(req.params.id);
  
  if (!designationPermission) {
    return res.status(404).json({ message: 'User designation permission not found' });
  }
  
  res.json({
    message: 'User designation permission retrieved successfully',
    data: designationPermission
  });
};

const createUserDesignationPermission = async (req, res) => {
  req.previousData = null; // For audit
  const designationPermission = await userDesignationPermissionService.createUserDesignationPermission(req.body, req.user._id);
  
  res.status(201).json({
    message: 'User designation permission created successfully',
    data: designationPermission
  });
};

const updateUserDesignationPermission = async (req, res) => {
  const previousDesignationPermission = await userDesignationPermissionService.getUserDesignationPermissionById(req.params.id);
  req.previousData = previousDesignationPermission?.toObject(); // For audit
  
  const designationPermission = await userDesignationPermissionService.updateUserDesignationPermission(req.params.id, req.body, req.user._id);
  
  res.json({
    message: 'User designation permission updated successfully',
    data: designationPermission
  });
};

const deleteUserDesignationPermission = async (req, res) => {
  await userDesignationPermissionService.deleteUserDesignationPermission(req.params.id, req.user._id);
  
  res.json({
    message: 'User designation permission deleted successfully'
  });
};

module.exports = {
  getUserDesignationPermissions,
  getUserDesignationPermission,
  createUserDesignationPermission,
  updateUserDesignationPermission,
  deleteUserDesignationPermission
};