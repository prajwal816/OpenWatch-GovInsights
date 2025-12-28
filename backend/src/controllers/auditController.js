import { getAuditLogsByRecordId, getAllAuditLogs } from '../services/auditService.js'

export const getAuditTrail = async (req, res, next) => {
    try {
        const { recordId } = req.params

        const auditLogs = await getAuditLogsByRecordId(recordId)

        res.json({
            success: true,
            recordId,
            auditTrail: auditLogs
        })
    } catch (error) {
        next(error)
    }
}

export const getSystemAudit = async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 50,
            action,
            userId,
            startDate,
            endDate
        } = req.query

        const filters = {}
        if (action) filters.action = action
        if (userId) filters.userId = userId
        if (startDate) filters.startDate = new Date(startDate)
        if (endDate) filters.endDate = new Date(endDate)

        const result = await getAllAuditLogs({
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