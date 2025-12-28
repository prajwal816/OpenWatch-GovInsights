import express from 'express'
import { getAuditTrail, getSystemAudit } from '../controllers/auditController.js'
import { authenticate, authorize } from '../middleware/auth.js'

const router = express.Router()

// GET /api/audit/:recordId - Get audit trail for a specific record (public)
router.get('/:recordId', getAuditTrail)

// GET /api/audit/system/all - Get system-wide audit logs (admin only)
router.get('/system/all', authenticate, authorize('admin'), getSystemAudit)

export default router