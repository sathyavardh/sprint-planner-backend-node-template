const permissionService = require('../services/permissionService');

const getPermissions = async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;
  const result = await permissionService.getAllPermissions(parseInt(page), parseInt(limit), search);
  
  res.json({
    message: 'Permissions retrieved successfully',
    data: result.permissions,
    pagination: result.pagination
  });
};

const getPermission = async (req, res) => {
  const permission = await permissionService.getPermissionById(req.params.id);
  
  if (!permission) {
    return res.status(404).json({ message: 'Permission not found' });
  }
  
  res.json({
    message: 'Permission retrieved successfully',
    data: permission
  });
};

const createPermission = async (req, res) => {
  req.previousData = null; // For audit
  const permission = await permissionService.createPermission(req.body, req.user._id);
  
  res.status(201).json({
    message: 'Permission created successfully',
    data: permission
  });
};

const updatePermission = async (req, res) => {
  const previousPermission = await permissionService.getPermissionById(req.params.id);
  req.previousData = previousPermission?.toObject(); // For audit
  
  const permission = await permissionService.updatePermission(req.params.id, req.body, req.user._id);
  
  res.json({
    message: 'Permission updated successfully',
    data: permission
  });
};

const deletePermission = async (req, res) => {
  await permissionService.deletePermission(req.params.id, req.user._id);
  
  res.json({
    message: 'Permission deleted successfully'
  });
};

module.exports = {
  getPermissions,
  getPermission,
  createPermission,
  updatePermission,
  deletePermission
};