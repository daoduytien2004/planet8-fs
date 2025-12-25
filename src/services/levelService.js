import axiosInstance from '../config/axiosConfig';

const levelService = {
    // Get all levels
    getAll: async () => {
        try {
            const response = await axiosInstance.get('/levels');
            return response.data.data;
        } catch (error) {
            console.error('Error fetching levels:', error);
            throw error;
        }
    }
};

export default levelService;
