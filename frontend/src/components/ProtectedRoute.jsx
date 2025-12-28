import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children, requiredRole = null }) => {
    const { isAuthenticated, user, loading } = useAuth()

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    if (requiredRole && user?.role !== requiredRole && user?.role !== 'admin') {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
                <p className="text-gray-600">You don't have permission to access this page.</p>
            </div>
        )
    }

    return children
}

export default ProtectedRoute