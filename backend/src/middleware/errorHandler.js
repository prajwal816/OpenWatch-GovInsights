export const errorHandler = (err, req, res, next) => {
    console.error('Error:', err)

    // Default error
    let error = {
        message: err.message || 'Internal Server Error',
        status: err.status || 500
    }

    // Validation errors
    if (err.name === 'ValidationError') {
        error.status = 400
        error.message = Object.values(err.errors).map(e => e.message).join(', ')
    }

    // Duplicate key error (PostgreSQL)
    if (err.code === '23505') {
        error.status = 400
        error.message = 'Resource already exists'
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        error.status = 401
        error.message = 'Invalid token'
    }

    // Zod validation errors
    if (err.name === 'ZodError') {
        error.status = 400
        error.message = err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
    }

    res.status(error.status).json({
        success: false,
        message: error.message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    })
}