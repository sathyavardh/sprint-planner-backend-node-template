const express = require('express');
const { getAudits, getAudit } = require('../controllers/auditController');
const { authenticate, authorize } = require('../middlewares/auth');
const { PERMISSIONS } = require('../config/constants');

const router = express.Router();

router.use(authenticate);
router.use(authorize([PERMISSIONS.AUDIT_READ]));

router.get('/', getAudits);
router.get('/:id', getAudit);

module.exports = router;