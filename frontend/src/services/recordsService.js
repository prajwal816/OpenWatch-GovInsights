import api from './authService'

export const recordsService = {
    async getRecords(params = {}) {
        const response = await api.get('/records', { params })
        return response.data
    },

    async getRecord(id) {
        const response = await api.get(`/records/${id}`)
        return response.data
    },

    async createRecord(recordData) {
        const response = await api.post('/records', recordData)
        return response.data
    },

    async updateRecord(id, recordData) {
        const response = await api.put(`/records/${id}`, recordData)
        return response.data
    },

    async deleteRecord(id) {
        const response = await api.delete(`/records/${id}`)
        return response.data
    },

    async getAuditTrail(recordId) {
        const response = await api.get(`/audit/${recordId}`)
        return response.data
    }
}