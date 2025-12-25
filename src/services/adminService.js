import axiosInstance from '../config/axiosConfig';

const adminService = {
    // Get all users (paginated)
    getAllUsers: async (page = 1, limit = 10) => {
        try {
            const response = await axiosInstance.get(`/users?page=${page}&limit=${limit}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    },

    // Get single user details
    getUser: async (userId) => {
        try {
            const response = await axiosInstance.get(`/users/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user:', error);
            throw error;
        }
    },

    // Update user (including role)
    updateUser: async (userId, updateData) => {
        try {
            const response = await axiosInstance.put(`/users/${userId}`, updateData);
            return response.data;
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    },

    // Delete user
    deleteUser: async (userId) => {
        try {
            const response = await axiosInstance.delete(`/users/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    },

    // Get user statistics
    getUserStats: async () => {
        try {
            const response = await axiosInstance.get('/users');

            if (response.data.success) {
                const users = response.data.data.items;
                const totalUsers = response.data.data.pagination.totalItems;
                const adminCount = users.filter(u => u.role === 'admin').length;
                const userCount = totalUsers - adminCount;

                return {
                    totalUsers,
                    adminCount,
                    userCount
                };
            }
            return null;
        } catch (error) {
            console.error('Error fetching user stats:', error);
            throw error;
        }
    }
};

export default adminService;
