import {
    getAllRecords,
    getRecordById,
    createNewRecord,
    updateExistingRecord,
    deleteExistingRecord
} from '../services/recordsService.js'
import { createAuditLog } from '../services/auditService.js'
import { hashRecord } from '../services/blockchainService.js'

export const getRecords = async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 20,
            search,
            department,
            status,
            createdBy
        } = req.query

        const filters = {}
        if (search) filters.search = search
        if (department) filters.department = department
        if (status) filters.status = status
        if (createdBy) filters.createdBy = createdBy

        const result = await getAllRecords({
            page: parseInt(page),
            limit: parseInt(limit),
            filters
        })

        res.json({
            success: true,
            ...result
        })
    } catch (error) {
        next(error)
    }
}

export const getRecord = async (req, res, next) => {
    try {
        const { id } = req.params

        const record = await getRecordById(id)
        if (!record) {
            return res.status(404).json({ message: 'Record not found' })
        }

        res.json({
            success: true,
            record
        })
    } catch (error) {
        next(error)
    }
}

export const createRecord = async (req, res, next) => {
    try {
        const recordData = {
            ...req.body,
            createdBy: req.user.id,
            createdByName: req.user.name
        }

        const record = await createNewRecord(recordData)

        // Create audit log
        await createAuditLog({
            recordId: record.id,
            action: 'CREATE',
            userId: req.user.id,
            userName: req.user.name,
            changes: recordData
        })

        // Optional: Hash record for blockchain verification
        try {
            const hash = await hashRecord(record)
            if (hash) {
                record.blockchainHash = hash
            }
        } catch (blockchainError) {
            console.warn('Blockchain hashing failed:', blockchainError.message)
            // Continue without blockchain verification
        }

        res.status(201).json({
            success: true,
            record
        })
    } catch (error) {
        next(error)
    }
}

export const updateRecord = async (req, res, next) => {
    try {
        const { id } = req.params
        const updates = req.body

        // Get existing record
        const existingRecord = await getRecordById(id)
        if (!existingRecord) {
            return res.status(404).json({ message: 'Record not found' })
        }

        // Check permissions - officials can only update their own records
        if (req.user.role === 'official' && existingRecord.createdBy !== req.user.id) {
            return res.status(403).json({ message: 'You can only update your own records' })
        }

        const updatedRecord = await updateExistingRecord(id, {
            ...updates,
            updatedBy: req.user.id,
            updatedByName: req.user.name
        })

        // Create audit log
        await createAuditLog({
            recordId: id,
            action: 'UPDATE',
            userId: req.user.id,
            userName: req.user.name,
            changes: updates,
            previousData: existingRecord
        })

        res.json({
            success: true,
            record: updatedRecord
        })
    } catch (error) {
        next(error)
    }
}

export const deleteRecord = async (req, res, next) => {
    try {
        const { id } = req.params

        const existingRecord = await getRecordById(id)
        if (!existingRecord) {
            return res.status(404).json({ message: 'Record not found' })
        }

        await deleteExistingRecord(id)

        // Create audit log
        await createAuditLog({
            recordId: id,
            action: 'DELETE',
            userId: req.user.id,
            userName: req.user.name,
            previousData: existingRecord
        })

        res.json({
            success: true,
            message: 'Record deleted successfully'
        })
    } catch (error) {
        next(error)
    }
}