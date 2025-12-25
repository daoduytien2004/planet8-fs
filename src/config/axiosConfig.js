import axios from 'axios';
import tokenService from '../services/tokenService';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Create axios instance with default config
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token to headers
axiosInstance.interceptors.request.use(
    (config) => {
        const token = tokenService.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle 401/403 errors
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // 1. Handle 401 (Unauthorized)
        if (error.response && error.response.status === 401) {
            console.warn('Unauthorized - redirecting to login');
            tokenService.removeToken();
            tokenService.removeUser();
            window.dispatchEvent(new Event('authChange'));
            window.location.href = '/login';
            return Promise.reject(error);
        }

        if (
            error.response &&
            error.response.status === 403 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true; // Mark as retried

            try {
                // Call refresh token
                const response = await axiosInstance.get('/auth/refresh-token', { withCredentials: true });
                const { accessToken } = response.data.data;
                const newToken = accessToken;

                // Update local storage/state
                tokenService.setToken(newToken);
                // Update header for the retry
                originalRequest.headers['Authorization'] = 'Bearer ' + newToken;

                // Retry the original request
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // If refresh fails, logout and redirect
                console.error("Refresh token failed", refreshError);
                tokenService.removeToken();
                tokenService.removeUser();
                window.dispatchEvent(new Event('authChange'));
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
