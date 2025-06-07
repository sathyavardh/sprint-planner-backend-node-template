const express = require('express');
const {
  getUserDesignationPermissions,
  getUserDesignationPermission,
  createUserDesignationPermission,
  updateUserDesignationPermission,
  deleteUserDesignationPermission
} = require('../controllers/userDesignationPermissionController');
const { authenticate, authorize } = require('../middlewares/auth');
const { auditMiddleware } = require('../middlewares/audit');
const { validateUserDesignationPermission } = require('../validators/userDesignationPermissionValidator');
const { PERMISSIONS } = require('../config/constants');

const router = express.Router();

router.use(authenticate);

router.get('/', 
  authorize([PERMISSIONS.PERMISSION_READ]), 
  getUserDesignationPermissions
);

router.get('/:id', 
  authorize([PERMISSIONS.PERMISSION_READ]), 
  getUserDesignationPermission
);

router.post('/', 
  authorize([PERMISSIONS.PERMISSION_CREATE]), 
  validateUserDesignationPermission,
  auditMiddleware('UserDesignationPermission'),
  createUserDesignationPermission
);

router.put('/:id', 
  authorize([PERMISSIONS.PERMISSION_UPDATE]), 
  validateUserDesignationPermission,
  auditMiddleware('UserDesignationPermission'),
  updateUserDesignationPermission
);

router.delete('/:id', 
  authorize([PERMISSIONS.PERMISSION_DELETE]), 
  auditMiddleware('UserDesignationPermission'),
  deleteUserDesignationPermission
);

module.exports = router;