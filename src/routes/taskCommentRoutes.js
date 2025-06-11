const express = require('express');
const {
  getAllComments,
  getComment,
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

router.get('/',
  authorize([PERMISSIONS.TASKCOMMENT_READ]),
  getAllComments
);

router.get('/:id',
  authorize([PERMISSIONS.TASKCOMMENT_READ]),
  getComment
);

router.post('/',
  authorize([PERMISSIONS.TASKCOMMENT_CREATE]),
  validateTaskComment,
  auditMiddleware('TaskComment'),
  createComment
);

router.put('/:id',
  authorize([PERMISSIONS.TASKCOMMENT_UPDATE]),
  validateTaskComment,
  auditMiddleware('TaskComment'),
  updateComment
);

router.delete('/:id',
  authorize([PERMISSIONS.TASKCOMMENT_DELETE]),
  auditMiddleware('TaskComment'),
  deleteComment
);

module.exports = router;
