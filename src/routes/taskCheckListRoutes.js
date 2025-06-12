const express = require('express');
const {
  createChecklist,
  getChecklist,
  getChecklistsByTaskId,
  getAllChecklists,
  updateChecklist,
  deleteChecklist
} = require('../controllers/taskCheckListController');

const { authenticate, authorize } = require('../middlewares/auth');
const { auditMiddleware } = require('../middlewares/audit');
const { validateChecklist } = require('../validators/taskCheckListValidator');
const { PERMISSIONS } = require('../config/constants');

const router = express.Router();

router.use(authenticate);

router.post('/',
  authorize([PERMISSIONS.TASKCHECKLIST_CREATE]),
  validateChecklist,
  auditMiddleware('TaskCheckList'),
  createChecklist
);

router.get('/task/:id',
  authorize([PERMISSIONS.TASKCHECKLIST_READ]),
  getChecklistsByTaskId
);

router.get('/:id',
  authorize([PERMISSIONS.TASKCHECKLIST_READ]),
  getChecklist
);

router.get('/',
  authorize([PERMISSIONS.TASKCHECKLIST_READ]),
  getAllChecklists
);

router.put('/:id',
  authorize([PERMISSIONS.TASKCHECKLIST_UPDATE]),
  validateChecklist,
  auditMiddleware('TaskCheckList'),
  updateChecklist
);

router.delete('/:id',
  authorize([PERMISSIONS.TASKCHECKLIST_DELETE]),
  auditMiddleware('TaskCheckList'),
  deleteChecklist
);

module.exports = router;
