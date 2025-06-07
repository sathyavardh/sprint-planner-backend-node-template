const express = require('express');
const {
  getPermissions,
  getPermission,
  createPermission,
  updatePermission,
  deletePermission
} = require('../controllers/permissionController');
const { authenticate, authorize } = require('../middlewares/auth');
const { auditMiddleware } = require('../middlewares/audit');
const { validatePermission } = require('../validators/permissionValidator');
const { PERMISSIONS } = require('../config/constants');

const router = express.Router();

router.use(authenticate);

router.get('/', 
  authorize([PERMISSIONS.PERMISSION_READ]), 
  getPermissions
);

router.get('/:id', 
  authorize([PERMISSIONS.PERMISSION_READ]), 
  getPermission
);

router.post('/', 
  authorize([PERMISSIONS.PERMISSION_CREATE]), 
  validatePermission,
  auditMiddleware('Permission'),
  createPermission
);

router.put('/:id', 
  authorize([PERMISSIONS.PERMISSION_UPDATE]), 
  validatePermission,
  auditMiddleware('Permission'),
  updatePermission
);

router.delete('/:id', 
  authorize([PERMISSIONS.PERMISSION_DELETE]), 
  auditMiddleware('Permission'),
  deletePermission
);

module.exports = router;