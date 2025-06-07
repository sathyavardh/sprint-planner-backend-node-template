//Authentication & Authorization Middleware

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const UserDesignationPermission = require('../models/UserDesignationPermission');

const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    const user = await User.findById(decoded.id).populate('userDesignation');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token.' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

const authorize = (requiredPermissions = []) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Authentication required.' });
      }

      // Get user permissions
      const userDesignationPermission = await UserDesignationPermission
        .findOne({ userDesignationId: req.user.userDesignation._id })
        .populate('permissions');

      if (!userDesignationPermission) {
        return res.status(403).json({ message: 'No permissions assigned.' });
      }

      const userPermissions = userDesignationPermission.permissions.map(p => p.permissionName);

      // Check if user has required permissions
      const hasPermission = requiredPermissions.every(permission => 
        userPermissions.includes(permission)
      );

      if (!hasPermission) {
        return res.status(403).json({ 
          message: 'Insufficient permissions.',
          required: requiredPermissions,
          userPermissions
        });
      }

      req.userPermissions = userPermissions;
      next();
    } catch (error) {
      res.status(500).json({ message: 'Authorization error', error: error.message });
    }
  };
};

module.exports = { authenticate, authorize };