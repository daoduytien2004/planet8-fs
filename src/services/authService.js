import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const TOKEN_KEY = 'planet8_auth_token';
const USER_KEY = 'planet8_user';

const authService = {
    // Login user
    login: async (username, password) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/login`, {
                username,
                password
            });

            if (response.data.success && response.data.data.accessToken) {
                authService.setToken(response.data.data.accessToken);
                authService.setUser(response.data.data.user);
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
        if (token) {
            localStorage.setItem(TOKEN_KEY, token);
        }
    },

    // Get token from localStorage
    getToken: () => {
        return localStorage.getItem(TOKEN_KEY);
    },

    // Remove token from localStorage
    removeToken: () => {
        localStorage.removeItem(TOKEN_KEY);
    },

    // Store user data
    setUser: (user) => {
        if (user) {
            localStorage.setItem(USER_KEY, JSON.stringify(user));
        }
    },

    // Get user data
    getUser: () => {
        const userData = localStorage.getItem(USER_KEY);
        return userData ? JSON.parse(userData) : null;
    },

    // Remove user data
    removeUser: () => {
        localStorage.removeItem(USER_KEY);
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        return !!authService.getToken();
    },

    // Check if user is admin
    isAdmin: () => {
        const user = authService.getUser();
        return user && user.role === 'admin';
    },

    // Get user role
    getUserRole: () => {
        const user = authService.getUser();
        return user ? user.role : null;
    },

    // Get current user's quiz stats
    getMyStats: async () => {
        try {
            const token = authService.getToken();
            if (!token) throw new Error('Not authenticated');

            const response = await axios.get(`${API_BASE_URL}/users/me/stats`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

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
        authService.removeToken();
        authService.removeUser();
        // Dispatch event to notify other components
        window.dispatchEvent(new Event('authChange'));
    }
};

export default authService;
