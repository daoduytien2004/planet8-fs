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
            // Backend returns {success: true, data: {...}}
            return response.data.data || null;
        } catch (error) {
            console.error(`Error fetching planet ${id}:`, error);
            throw error;
        }
    }
}
export default planetService;