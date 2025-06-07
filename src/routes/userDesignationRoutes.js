const express = require('express');
const {
  getUserDesignations,
  getUserDesignation,
  createUserDesignation,
  updateUserDesignation,
  deleteUserDesignation
} = require('../controllers/userDesignationController');
const { authenticate, authorize } = require('../middlewares/auth');
const { auditMiddleware } = require('../middlewares/audit');
const { validateUserDesignation } = require('../validators/userDesignationValidator');
const { PERMISSIONS } = require('../config/constants');

const router = express.Router();

router.use(authenticate);

router.get('/', 
  authorize([PERMISSIONS.DESIGNATION_READ]), 
  getUserDesignations
);

router.get('/:id', 
  authorize([PERMISSIONS.DESIGNATION_READ]), 
  getUserDesignation
);

router.post('/', 
  authorize([PERMISSIONS.DESIGNATION_CREATE]), 
  validateUserDesignation,
  auditMiddleware('UserDesignation'),
  createUserDesignation
);

router.put('/:id', 
  authorize([PERMISSIONS.DESIGNATION_UPDATE]), 
  validateUserDesignation,
  auditMiddleware('UserDesignation'),
  updateUserDesignation
);

router.delete('/:id', 
  authorize([PERMISSIONS.DESIGNATION_DELETE]), 
  auditMiddleware('UserDesignation'),
  deleteUserDesignation
);

module.exports = router;