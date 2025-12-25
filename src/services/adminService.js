import axios from 'axios';
import authService from './authService';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const adminService = {
    // Get authorization headers
    getAuthHeaders: () => {
        const token = authService.getToken();
        return {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
    },

    // Get all users (paginated)
    getAllUsers: async (page = 1, limit = 10) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/users?page=${page}&limit=${limit}`,
                adminService.getAuthHeaders()
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    },

    // Get single user details
    getUser: async (userId) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/users/${userId}`,
                adminService.getAuthHeaders()
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching user:', error);
            throw error;
        }
    },

    // Update user (including role)
    updateUser: async (userId, updateData) => {
        try {
            const response = await axios.put(
                `${API_BASE_URL}/users/${userId}`,
                updateData,
                adminService.getAuthHeaders()
            );
            return response.data;
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    },

    // Delete user
    deleteUser: async (userId) => {
        try {
            const response = await axios.delete(
                `${API_BASE_URL}/users/${userId}`,
                adminService.getAuthHeaders()
            );
            return response.data;
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    },

    // Get user statistics
    getUserStats: async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/users`,
                adminService.getAuthHeaders()
            );

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
