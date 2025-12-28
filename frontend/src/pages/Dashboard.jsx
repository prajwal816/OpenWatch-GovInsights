import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { recordsService } from '../services/recordsService'
import { Plus, Edit, Trash2, Eye, FileText, Users, Activity } from 'lucide-react'

const Dashboard = () => {
    const { user, isOfficial, isAdmin } = useAuth()
    const [records, setRecords] = useState([])
    const [stats, setStats] = useState({
        totalRecords: 0,
        myRecords: 0,
        pendingReviews: 0
    })
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadDashboardData()
    }, [])

    const loadDashboardData = async () => {
        try {
            const data = await recordsService.getRecords({ createdBy: user.id })
            setRecords(data.records || [])
            setStats({
                totalRecords: data.total || 0,
                myRecords: data.records?.length || 0,
                pendingReviews: data.records?.filter(r => r.status === 'Under Review').length || 0
            })
        } catch (error) {
            console.error('Failed to load dashboard data:', error)
        } finally {
            setLoading(false)
        }
    }

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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Welcome back, {user.name}
                </h1>
                <p className="text-gray-600">
                    Manage your records and track transparency metrics
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">My Records</p>
                            <p className="text-3xl font-bold text-gray-900">{stats.myRecords}</p>
                        </div>
                        <FileText className="h-8 w-8 text-primary-600" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
                            <p className="text-3xl font-bold text-gray-900">{stats.pendingReviews}</p>
                        </div>
                        <Eye className="h-8 w-8 text-yellow-600" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Access</p>
                            <p className="text-3xl font-bold text-gray-900">1,247</p>
                        </div>
                        <Activity className="h-8 w-8 text-green-600" />
                    </div>
                </div>
            </div>

            {/* Actions */}
            {isOfficial && (
                <div className="mb-6">
                    <button
                        onClick={() => setShowCreateForm(true)}
                        className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors flex items-center space-x-2"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Create New Record</span>
                    </button>
                </div>
            )}

            {/* Recent Records */}
            <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-900">Recent Records</h2>
                </div>
                <div className="divide-y">
                    {records.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">
                            No records found. {isOfficial && 'Create your first record to get started.'}
                        </div>
                    ) : (
                        records.slice(0, 5).map((record) => (
                            <div key={record.id} className="p-6 hover:bg-gray-50">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900 mb-1">
                                            {record.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-2">
                                            {record.description}
                                        </p>
                                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                                            <span>{record.department}</span>
                                            <span>{new Date(record.createdAt).toLocaleDateString()}</span>
                                            <span className={`px-2 py-1 rounded-full ${record.status === 'Active' ? 'bg-green-100 text-green-800' :
                                                    record.status === 'Archived' ? 'bg-gray-100 text-gray-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {record.status}
                                            </span>
                                        </div>
                                    </div>
                                    {isOfficial && (
                                        <div className="flex items-center space-x-2 ml-4">
                                            <button className="p-2 text-gray-400 hover:text-primary-600">
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-red-600">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Create Record Modal */}
            {showCreateForm && (
                <CreateRecordModal
                    onClose={() => setShowCreateForm(false)}
                    onSuccess={() => {
                        setShowCreateForm(false)
                        loadDashboardData()
                    }}
                />
            )}
        </div>
    )
}

const CreateRecordModal = ({ onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        department: '',
        status: 'Active'
    })
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            await recordsService.createRecord(formData)
            onSuccess()
        } catch (error) {
            console.error('Failed to create record:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
                <h3 className="text-lg font-semibold mb-4">Create New Record</h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Department
                        </label>
                        <select
                            value={formData.department}
                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="">Select Department</option>
                            <option value="Health">Health</option>
                            <option value="Education">Education</option>
                            <option value="Transportation">Transportation</option>
                            <option value="Finance">Finance</option>
                            <option value="Public Safety">Public Safety</option>
                        </select>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
                        >
                            {loading ? 'Creating...' : 'Create Record'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Dashboard