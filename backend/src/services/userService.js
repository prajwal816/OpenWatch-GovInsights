// Mock database - replace with actual database implementation
let users = [
    {
        id: '1',
        name: 'Demo Official',
        email: 'official@demo.com',
        password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', // password
        role: 'official',
        createdAt: new Date().toISOString()
    },
    {
        id: '2',
        name: 'Demo Admin',
        email: 'admin@demo.com',
        password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', // password
        role: 'admin',
        createdAt: new Date().toISOString()
    },
    {
        id: '3',
        name: 'Demo Citizen',
        email: 'citizen@demo.com',
        password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', // password
        role: 'citizen',
        createdAt: new Date().toISOString()
    }
]

export const getUserById = async (id) => {
    return users.find(user => user.id === id)
}

export const getUserByEmail = async (email) => {
    return users.find(user => user.email === email)
}

export const createUser = async (userData) => {
    const newUser = {
        id: (users.length + 1).toString(),
        ...userData,
        createdAt: new Date().toISOString()
    }

    users.push(newUser)
    return newUser
}

export const updateUser = async (id, updates) => {
    const userIndex = users.findIndex(user => user.id === id)
    if (userIndex === -1) return null

    users[userIndex] = {
        ...users[userIndex],
        ...updates,
        updatedAt: new Date().toISOString()
    }

    return users[userIndex]
}

export const deleteUser = async (id) => {
    const userIndex = users.findIndex(user => user.id === id)
    if (userIndex === -1) return false

    users.splice(userIndex, 1)
    return true
}

// PostgreSQL implementation example:
/*
import pg from 'pg'
const { Pool } = pg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

export const getUserById = async (id) => {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [id])
  return result.rows[0]
}

export const getUserByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
  return result.rows[0]
}

export const createUser = async (userData) => {
  const { name, email, password, role } = userData
  const result = await pool.query(
    'INSERT INTO users (name, email, password, role, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
    [name, email, password, role]
  )
  return result.rows[0]
}
*/