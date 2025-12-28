import express from 'express'
import { login, register, getCurrentUser } from '../controllers/authController.js'
import { authenticate } from '../middleware/auth.js'
import { validate, schemas } from '../middleware/validation.js'

const router = express.Router()

// POST /api/auth/login
router.post('/login', validate(schemas.login), login)

// POST /api/auth/register
router.post('/register', validate(schemas.register), register)

// GET /api/auth/me
router.get('/me', authenticate, getCurrentUser)

export default router