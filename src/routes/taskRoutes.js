const express = require('express');
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask
} = require('../controllers/taskController');
const { authenticate, authorize } = require('../middlewares/auth');
const { auditMiddleware } = require('../middlewares/audit');
const { validateTask } = require('../validators/taskValidator');
const { PERMISSIONS } = require('../config/constants');

const router = express.Router();

router.use(authenticate);

router.get('/',
  authorize([PERMISSIONS.TASK_READ]),
  getTasks
);

router.get('/:id',
  authorize([PERMISSIONS.TASK_READ]),
  getTask
);

router.post('/',
  authorize([PERMISSIONS.TASK_CREATE]),
  validateTask,
  auditMiddleware('Task'),
  createTask
);

router.put('/:id',
  authorize([PERMISSIONS.TASK_UPDATE]),
  validateTask,
  auditMiddleware('Task'),
  updateTask
);

router.delete('/:id',
  authorize([PERMISSIONS.TASK_DELETE]),
  auditMiddleware('Task'),
  deleteTask
);

module.exports = router;
