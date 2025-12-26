import axiosInstance from '../config/axiosConfig';

const planetService = {
    getAll: async () => {
        try {
            const response = await axiosInstance.get(`/planets`);
            // Backend returns {success: true, data: {pagination, items: [...]}}
            // Axios gives us response.data = {success, data: {pagination, items}}
            // So we need response.data.data.items to get the actual array
            return response.data.data?.items || [];
        } catch (error) {
            console.error('Error fetching planets:', error);
            throw error;
        }
    },
    getById: async (id) => {
        try {
            const response = await axiosInstance.get(`/planets/${id}`);
            return response.data.data || null;
        } catch (error) {
            console.error(`Error fetching planet ${id}:`, error);
            throw error;
        }
    },
    create: async (data) => {
        try {
            const response = await axiosInstance.post('/planets', data);
            return response.data;
        } catch (error) {
            console.error('Error creating planet:', error);
            throw error;
        }
    },
    update: async (id, data) => {
        try {
            const response = await axiosInstance.put(`/planets/${id}`, data);
            return response.data;
        } catch (error) {
            console.error(`Error updating planet ${id}:`, error);
            throw error;
        }
    },
    delete: async (id) => {
        try {
            const response = await axiosInstance.delete(`/planets/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting planet ${id}:`, error);
            throw error;
        }
    }
}
export default planetService;