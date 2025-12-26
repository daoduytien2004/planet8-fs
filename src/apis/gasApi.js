import axiosInstance from '../config/axiosConfig';

const gasApi = {
    getAll: async (params) => {
        const url = '/gases';
        const response = await axiosInstance.get(url, { params });
        return response.data;
    },

    getById: async (id) => {
        const url = `/gases/${id}`;
        const response = await axiosInstance.get(url);
        return response.data;
    },

    create: async (data) => {
        const url = '/gases';
        const response = await axiosInstance.post(url, data);
        return response.data;
    },

    update: async (id, data) => {
        const url = `/gases/${id}`;
        const response = await axiosInstance.put(url, data);
        return response.data;
    },

    delete: async (id) => {
        const url = `/gases/${id}`;
        const response = await axiosInstance.delete(url);
        return response.data;
    }
};

export default gasApi;
