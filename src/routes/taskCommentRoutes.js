const express = require('express');
const {
  getComment,
  getComments,
  createComment,
  updateComment,
  deleteComment
} = require('../controllers/taskCommentController');
const { authenticate, authorize } = require('../middlewares/auth');
const { auditMiddleware } = require('../middlewares/audit');
const { validateTaskComment } = require('../validators/taskCommentValidator');
const { PERMISSIONS } = require('../config/constants');

const router = express.Router();

router.use(authenticate);

// Get all comments for a specific task
router.get('/task/:taskId',
  authorize([PERMISSIONS.TASKCOMMENT_READ]),
  getComments
);

// Get a specific comment by ID
router.get('/:id',
  authorize([PERMISSIONS.TASKCOMMENT_READ]),
  getComment
);

// Create a new comment
router.post('/',
  authorize([PERMISSIONS.TASKCOMMENT_CREATE]),
  validateTaskComment,
  auditMiddleware('TaskComment'),
  createComment
);

// Update a comment
router.put('/:id',
  authorize([PERMISSIONS.TASKCOMMENT_UPDATE]),
  validateTaskComment,
  auditMiddleware('TaskComment'),
  updateComment
);

// Delete a comment
router.delete('/:id',
  authorize([PERMISSIONS.TASKCOMMENT_DELETE]),
  auditMiddleware('TaskComment'),
  deleteComment
);

module.exports = router;