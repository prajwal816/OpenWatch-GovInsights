import express from 'express'
import {
    getRecords,
    getRecord,
    createRecord,
    updateRecord,
    deleteRecord
} from '../controllers/recordsController.js'
import { authenticate, authorize } from '../middleware/auth.js'
import { validate, schemas } from '../middleware/validation.js'

const router = express.Router()

// GET /api/records - Public access to view records
router.get('/', getRecords)

// GET /api/records/:id - Public access to view specific record
router.get('/:id', getRecord)

// POST /api/records - Officials and admins can create records
router.post('/',
    authenticate,
    authorize('official', 'admin'),
    validate(schemas.record),
    createRecord
)

// PUT /api/records/:id - Officials can update their own records, admins can update any
router.put('/:id',
    authenticate,
    authorize('official', 'admin'),
    validate(schemas.updateRecord),
    updateRecord
)

// DELETE /api/records/:id - Only admins can delete records
router.delete('/:id',
    authenticate,
    authorize('admin'),
    deleteRecord
)

export default router