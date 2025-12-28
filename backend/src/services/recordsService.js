// Mock database - replace with actual database implementation
let records = [
    {
        id: '1',
        title: 'City Budget Allocation 2024',
        description: 'Detailed breakdown of the city budget allocation for the fiscal year 2024, including infrastructure, education, and public safety spending.',
        department: 'Finance',
        status: 'Active',
        createdBy: '1',
        createdByName: 'Demo Official',
        createdAt: new Date('2024-01-15').toISOString(),
        updatedAt: new Date('2024-01-15').toISOString()
    },
    {
        id: '2',
        title: 'Public Health Initiative Report',
        description: 'Comprehensive report on the new public health initiatives launched in response to community health needs assessment.',
        department: 'Health',
        status: 'Active',
        createdBy: '1',
        createdByName: 'Demo Official',
        createdAt: new Date('2024-02-01').toISOString(),
        updatedAt: new Date('2024-02-01').toISOString()
    },
    {
        id: '3',
        title: 'Transportation Infrastructure Plan',
        description: 'Long-term plan for improving city transportation infrastructure, including road maintenance and public transit expansion.',
        department: 'Transportation',
        status: 'Under Review',
        createdBy: '2',
        createdByName: 'Demo Admin',
        createdAt: new Date('2024-02-10').toISOString(),
        updatedAt: new Date('2024-02-10').toISOString()
    }
]

export const getAllRecords = async ({ page = 1, limit = 20, filters = {} }) => {
    let filteredRecords = [...records]

    // Apply filters
    if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        filteredRecords = filteredRecords.filter(record =>
            record.title.toLowerCase().includes(searchTerm) ||
            record.description.toLowerCase().includes(searchTerm)
        )
    }

    if (filters.department) {
        filteredRecords = filteredRecords.filter(record =>
            record.department === filters.department
        )
    }

    if (filters.status) {
        filteredRecords = filteredRecords.filter(record =>
            record.status === filters.status
        )
    }

    if (filters.createdBy) {
        filteredRecords = filteredRecords.filter(record =>
            record.createdBy === filters.createdBy
        )
    }

    // Sort by creation date (newest first)
    filteredRecords.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedRecords = filteredRecords.slice(startIndex, endIndex)

    return {
        records: paginatedRecords,
        total: filteredRecords.length,
        page,
        limit,
        totalPages: Math.ceil(filteredRecords.length / limit)
    }
}

export const getRecordById = async (id) => {
    return records.find(record => record.id === id)
}

export const createNewRecord = async (recordData) => {
    const newRecord = {
        id: (records.length + 1).toString(),
        ...recordData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }

    records.push(newRecord)
    return newRecord
}

export const updateExistingRecord = async (id, updates) => {
    const recordIndex = records.findIndex(record => record.id === id)
    if (recordIndex === -1) return null

    records[recordIndex] = {
        ...records[recordIndex],
        ...updates,
        updatedAt: new Date().toISOString()
    }

    return records[recordIndex]
}

export const deleteExistingRecord = async (id) => {
    const recordIndex = records.findIndex(record => record.id === id)
    if (recordIndex === -1) return false

    records.splice(recordIndex, 1)
    return true
}

// PostgreSQL implementation example:
/*
import pg from 'pg'
const { Pool } = pg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

export const getAllRecords = async ({ page = 1, limit = 20, filters = {} }) => {
  let query = 'SELECT * FROM records WHERE 1=1'
  const params = []
  let paramCount = 0

  if (filters.search) {
    paramCount++
    query += ` AND (title ILIKE $${paramCount} OR description ILIKE $${paramCount})`
    params.push(`%${filters.search}%`)
  }

  if (filters.department) {
    paramCount++
    query += ` AND department = $${paramCount}`
    params.push(filters.department)
  }

  if (filters.status) {
    paramCount++
    query += ` AND status = $${paramCount}`
    params.push(filters.status)
  }

  query += ' ORDER BY created_at DESC'
  
  const offset = (page - 1) * limit
  paramCount++
  query += ` LIMIT $${paramCount}`
  params.push(limit)
  
  paramCount++
  query += ` OFFSET $${paramCount}`
  params.push(offset)

  const result = await pool.query(query, params)
  
  // Get total count
  const countResult = await pool.query('SELECT COUNT(*) FROM records')
  const total = parseInt(countResult.rows[0].count)

  return {
    records: result.rows,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  }
}
*/