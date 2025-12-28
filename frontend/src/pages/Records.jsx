import { useState, useEffect } from 'react'
import { recordsService } from '../services/recordsService'
import { Search, Filter, Calendar, Building } from 'lucide-react'

const Records = () => {
    const [records, setRecords] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [departmentFilter, setDepartmentFilter] = useState('')
    const [statusFilter, setStatusFilter] = useState('')

    useEffect(() => {
        loadRecords()
    }, [searchTerm, departmentFilter, statusFilter])

    const loadRecords = async () => {
        try {
            const params = {}
            if (searchTerm) params.search = searchTerm
            if (departmentFilter) params.department = departmentFilter
            if (statusFilter) params.status = statusFilter

            const data = await recordsService.getRecords(params)
            setRecords(data.records || [])
        } catch (error) {
            console.error('Failed to load records:', error)
        } finally {
            setLoading(false)
        }
    }

    const departments = ['Health', 'Education', 'Transportation', 'Finance', 'Public Safety']
    const statuses = ['Active', 'Archived', 'Under Review']

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Public Records</h1>
                <p className="text-gray-600">
                    Browse and search through government records with full transparency
                </p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search records..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>

                    <div className="relative">
                        <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <select
                            value={departmentFilter}
                            onChange={(e) => setDepartmentFilter(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="">All Departments</option>
                            {departments.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                    </div>

                    <div className="relative">
                        <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="">All Statuses</option>
                            {statuses.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Records List */}
            <div className="space-y-4">
                {records.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No records found matching your criteria.</p>
                    </div>
                ) : (
                    records.map((record) => (
                        <div key={record.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        {record.title}
                                    </h3>
                                    <p className="text-gray-600 mb-3">{record.description}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${record.status === 'Active' ? 'bg-green-100 text-green-800' :
                                        record.status === 'Archived' ? 'bg-gray-100 text-gray-800' :
                                            'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {record.status}
                                </span>
                            </div>

                            <div className="flex items-center justify-between text-sm text-gray-500">
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-1">
                                        <Building className="h-4 w-4" />
                                        <span>{record.department}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Calendar className="h-4 w-4" />
                                        <span>{new Date(record.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div>
                                    Created by: {record.createdBy}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default Records