import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { createUser, getUserByEmail, getUserById } from '../services/userService.js'

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body

        // Find user by email
        const user = await getUserByEmail(email)
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        )

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user

        res.json({
            success: true,
            token,
            user: userWithoutPassword
        })
    } catch (error) {
        next(error)
    }
}

export const register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body

        // Check if user already exists
        const existingUser = await getUserByEmail(email)
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' })
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS) || 12)

        // Create user
        const user = await createUser({
            name,
            email,
            password: hashedPassword,
            role: role || 'citizen'
        })

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        )

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user

        res.status(201).json({
            success: true,
            token,
            user: userWithoutPassword
        })
    } catch (error) {
        next(error)
    }
}

export const getCurrentUser = async (req, res, next) => {
    try {
        const { password: _, ...userWithoutPassword } = req.user

        res.json({
            success: true,
            user: userWithoutPassword
        })
    } catch (error) {
        next(error)
    }
}