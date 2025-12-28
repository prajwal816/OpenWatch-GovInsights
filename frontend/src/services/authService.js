import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
    baseURL: API_BASE,
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export const authService = {
    async login(email, password) {
        const response = await api.post('/auth/login', { email, password })
        return response.data
    },

    async register(userData) {
        const response = await api.post('/auth/register', userData)
        return response.data
    },

    async getCurrentUser() {
        const response = await api.get('/auth/me')
        return response.data
    }
}

export default api