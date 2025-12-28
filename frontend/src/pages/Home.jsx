import { Link } from 'react-router-dom'
import { Eye, Shield, FileText, Users } from 'lucide-react'

const Home = () => {
    return (
        <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <div className="text-center py-16">
                <h1 className="text-5xl font-bold text-gray-900 mb-6">
                    Government Transparency Made Simple
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                    OpenWatch provides secure, auditable, and real-time access to government records,
                    promoting accountability and transparency in public administration.
                </p>
                <div className="flex justify-center space-x-4">
                    <Link
                        to="/records"
                        className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors"
                    >
                        Browse Records
                    </Link>
                    <Link
                        to="/login"
                        className="border border-primary-600 text-primary-600 px-8 py-3 rounded-lg hover:bg-primary-50 transition-colors"
                    >
                        Official Login
                    </Link>
                </div>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 py-16">
                <div className="text-center">
                    <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Eye className="h-8 w-8 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Transparent Access</h3>
                    <p className="text-gray-600">
                        Real-time access to public records with complete transparency
                    </p>
                </div>

                <div className="text-center">
                    <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Shield className="h-8 w-8 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Secure & Auditable</h3>
                    <p className="text-gray-600">
                        Every action is logged with optional blockchain verification
                    </p>
                </div>

                <div className="text-center">
                    <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="h-8 w-8 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Record Management</h3>
                    <p className="text-gray-600">
                        Comprehensive system for creating and managing public records
                    </p>
                </div>

                <div className="text-center">
                    <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="h-8 w-8 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Role-Based Access</h3>
                    <p className="text-gray-600">
                        Different access levels for citizens, officials, and administrators
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="bg-primary-600 text-white rounded-lg p-8 text-center">
                <div className="grid md:grid-cols-3 gap-8">
                    <div>
                        <div className="text-3xl font-bold mb-2">10,000+</div>
                        <div className="text-primary-100">Public Records</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold mb-2">50+</div>
                        <div className="text-primary-100">Government Departments</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold mb-2">99.9%</div>
                        <div className="text-primary-100">Uptime Guarantee</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home