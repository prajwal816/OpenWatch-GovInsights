import { z } from 'zod'

export const validate = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.body)
            next()
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    message: 'Validation failed',
                    errors: error.errors.map(err => ({
                        field: err.path.join('.'),
                        message: err.message
                    }))
                })
            }
            next(error)
        }
    }
}

// Common validation schemas
export const schemas = {
    login: z.object({
        email: z.string().email('Invalid email format'),
        password: z.string().min(6, 'Password must be at least 6 characters')
    }),

    register: z.object({
        name: z.string().min(2, 'Name must be at least 2 characters'),
        email: z.string().email('Invalid email format'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
        role: z.enum(['citizen', 'official', 'admin']).default('citizen')
    }),

    record: z.object({
        title: z.string().min(5, 'Title must be at least 5 characters'),
        description: z.string().min(10, 'Description must be at least 10 characters'),
        department: z.string().min(2, 'Department is required'),
        status: z.enum(['Active', 'Archived', 'Under Review']).default('Active')
    }),

    updateRecord: z.object({
        title: z.string().min(5, 'Title must be at least 5 characters').optional(),
        description: z.string().min(10, 'Description must be at least 10 characters').optional(),
        department: z.string().min(2, 'Department is required').optional(),
        status: z.enum(['Active', 'Archived', 'Under Review']).optional()
    })
}