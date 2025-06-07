const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');
const { authenticate, authorize } = require('../middlewares/auth');
const { auditMiddleware } = require('../middlewares/audit');
const { validateUser, validateUserUpdate } = require('../validators/userValidator');
const { PERMISSIONS } = require('../config/constants');

const router = express.Router();

router.use(authenticate);

router.get('/', 
  authorize([PERMISSIONS.USER_READ]), 
  getUsers
);

router.get('/:id', 
  authorize([PERMISSIONS.USER_READ]), 
  getUser
);

router.post('/', 
  authorize([PERMISSIONS.USER_CREATE]), 
  validateUser,
  auditMiddleware('User'),
  createUser
);

router.put('/:id', 
  authorize([PERMISSIONS.USER_UPDATE]), 
  validateUserUpdate,
  auditMiddleware('User'),
  updateUser
);

router.delete('/:id', 
  authorize([PERMISSIONS.USER_DELETE]), 
  auditMiddleware('User'),
  deleteUser
);

module.exports = router;