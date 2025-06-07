const userDesignationService = require('../services/userDesignationService');

const getUserDesignations = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const result = await userDesignationService.getAllUserDesignations(parseInt(page), parseInt(limit));
  
  res.json({
    message: 'User designations retrieved successfully',
    data: result.designations,
    pagination: result.pagination
  });
};

const getUserDesignation = async (req, res) => {
  const { includePermissions } = req.query;
  
  let designation;
  if (includePermissions === 'true') {
    designation = await userDesignationService.getUserDesignationWithPermissions(req.params.id);
  } else {
    designation = await userDesignationService.getUserDesignationById(req.params.id);
  }
  
  if (!designation) {
    return res.status(404).json({ message: 'User designation not found' });
  }
  
  res.json({
    message: 'User designation retrieved successfully',
    data: designation
  });
};

const createUserDesignation = async (req, res) => {
  try {
    req.previousData = null; // For audit
    
    const designation = await userDesignationService.createUserDesignation(req.body, req.user._id);
    
    res.status(201).json({
      message: 'User designation created successfully',
      data: designation
    });
  } catch (error) {
    console.error('Error creating user designation:', error);
    res.status(500).json({
      message: 'Failed to create user designation',
      error: error.message
    });
  }
};

const updateUserDesignation = async (req, res) => {
  try {
    const previousDesignation = await userDesignationService.getUserDesignationById(req.params.id);
    req.previousData = previousDesignation?.toObject(); // For audit
    
    const designation = await userDesignationService.updateUserDesignation(req.params.id, req.body, req.user._id);
    
    res.json({
      message: 'User designation updated successfully',
      data: designation
    });
  } catch (error) {
    console.error('Error updating user designation:', error);
    res.status(500).json({
      message: 'Failed to update user designation',
      error: error.message
    });
  }
};

const deleteUserDesignation = async (req, res) => {
  try {
    await userDesignationService.deleteUserDesignation(req.params.id, req.user._id);
    
    res.json({
      message: 'User designation deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user designation:', error);
    res.status(500).json({
      message: 'Failed to delete user designation',
      error: error.message
    });
  }
};

module.exports = {
  getUserDesignations,
  getUserDesignation,
  createUserDesignation,
  updateUserDesignation,
  deleteUserDesignation
};