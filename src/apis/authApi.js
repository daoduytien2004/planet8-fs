import axios from 'axios';
import axiosInstance from '../config/axiosConfig';
import tokenService from './tokenApi';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const authService = {
    // Login user
    login: async (username, password) => {
        try {
            // Use plain axios or axiosInstance. Login typically doesn't need the bearer token.
            const response = await axios.post(`${API_BASE_URL}/auth/login`, {
                username,
                password
            }, { withCredentials: true });

            if (response.data.success && response.data.data.accessToken) {
                tokenService.setToken(response.data.data.accessToken);
                tokenService.setUser(response.data.data.user);
                // Dispatch event to notify other components
                window.dispatchEvent(new Event('authChange'));
                return response.data;
            }
            throw new Error('Login failed');
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    // Register user
    register: async (username, email, password) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/register`, {
                username,
                email,
                password
            });

            if (response.data.success) {
                // Register doesn't return token, just success message
                return response.data;
            }
            throw new Error('Registration failed');
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    },

    // Store token in localStorage
    setToken: (token) => {
        tokenService.setToken(token);
    },

    // Get token from localStorage
    getToken: () => {
        return tokenService.getToken();
    },

    // Remove token from localStorage
    removeToken: () => {
        tokenService.removeToken();
    },

    // Store user data
    setUser: (user) => {
        tokenService.setUser(user);
    },

    // Get user data (with optional refresh from API)
    getUser: async (refresh = false) => {
        const cachedUser = tokenService.getUser();

        // If no cached user or not refreshing, return cached data
        if (!cachedUser || !refresh) {
            return cachedUser;
        }

        // Fetch fresh stats from API and merge
        try {
            const response = await authService.getMyStats();
            if (response) {
                console.log(response);
                const updatedUser = response.user;
                tokenService.setUser(updatedUser);
                window.dispatchEvent(new Event('authChange'));
                return updatedUser;
            }
            return cachedUser;
        } catch (error) {
            console.error('Error refreshing user stats:', error);
            return cachedUser;
        }
    },

    // Remove user data
    removeUser: () => {
        tokenService.removeUser();
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        return !!tokenService.getToken();
    },

    // Check if user is admin
    isAdmin: () => {
        const user = tokenService.getUser();
        return user && user.role === 'admin';
    },

    // Get user role
    getUserRole: () => {
        const user = tokenService.getUser();
        return user ? user.role : null;
    },

    // Get current user's quiz stats
    getMyStats: async () => {
        try {
            // Use axiosInstance to get auto-refresh capabilities
            const response = await axiosInstance.get('/users/me/stats');
            return response.data.data;
        } catch (error) {
            console.error('Error fetching user stats:', error);
            throw error;
        }
    },

    // Forgot password - request reset email
    forgotPassword: async (email) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/forgot-password`, {
                email
            });

            return response.data;
        } catch (error) {
            console.error('Forgot password error:', error);
            throw error;
        }
    },

    // Reset password with token
    resetPassword: async (token, newPassword) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/reset-password`, {
                token,
                newPassword
            });

            return response.data;
        } catch (error) {
            console.error('Reset password error:', error);
            throw error;
        }
    },

    // Logout - clear all auth data
    logout: () => {
        tokenService.removeToken();
        tokenService.removeUser();
        // Dispatch event to notify other components
        window.dispatchEvent(new Event('authChange'));
    }
};

export default authService;
