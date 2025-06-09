const express = require('express');
const {
  getSprints,
  getSprint,
  createSprint,
  updateSprint,
  deleteSprint
} = require('../controllers/sprintController');
const { authenticate, authorize } = require('../middlewares/auth');
const { auditMiddleware } = require('../middlewares/audit');
const { validateSprint } = require('../validators/sprintValidator');
const { PERMISSIONS } = require('../config/constants');

const router = express.Router();

// Require authentication for all sprint routes
router.use(authenticate);

// GET all sprints
router.get('/',
  authorize([PERMISSIONS.SPRINT_READ]),
  getSprints
);

// GET sprint by ID
router.get('/:id',
  authorize([PERMISSIONS.SPRINT_READ]),
  getSprint
);

// POST create sprint
router.post('/',
  authorize([PERMISSIONS.SPRINT_CREATE]),
  validateSprint,
  auditMiddleware('Sprint'),
  createSprint
);

// PUT update sprint
router.put('/:id',
  authorize([PERMISSIONS.SPRINT_UPDATE]),
  validateSprint,
  auditMiddleware('Sprint'),
  updateSprint
);

// DELETE sprint
router.delete('/:id',
  authorize([PERMISSIONS.SPRINT_DELETE]),
  auditMiddleware('Sprint'),
  deleteSprint
);

module.exports = router;