import jwt from 'jsonwebtoken'
import { getUserById } from '../services/userService.js'

export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Access token required' })
        }

        const token = authHeader.substring(7)
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await getUserById(decoded.userId)
        if (!user) {
            return res.status(401).json({ message: 'Invalid token' })
        }

        req.user = user
        next()
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' })
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' })
        }
        next(error)
    }
}

export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' })
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: 'Insufficient permissions',
                required: roles,
                current: req.user.role
            })
        }

        next()
    }
}