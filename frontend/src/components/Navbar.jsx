import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, LogOut, User } from 'lucide-react'

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth()

    return (
        <nav className="bg-white shadow-lg border-b">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center space-x-2">
                        <Eye className="h-8 w-8 text-primary-600" />
                        <span className="text-xl font-bold text-gray-900">OpenWatch</span>
                    </Link>

                    <div className="flex items-center space-x-6">
                        <Link
                            to="/records"
                            className="text-gray-700 hover:text-primary-600 transition-colors"
                        >
                            Public Records
                        </Link>

                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    className="text-gray-700 hover:text-primary-600 transition-colors"
                                >
                                    Dashboard
                                </Link>
                                <div className="flex items-center space-x-3">
                                    <div className="flex items-center space-x-2">
                                        <User className="h-4 w-4" />
                                        <span className="text-sm text-gray-600">
                                            {user?.name} ({user?.role})
                                        </span>
                                    </div>
                                    <button
                                        onClick={logout}
                                        className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar