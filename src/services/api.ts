import api from '@/lib/axios';
import { AxiosRequestConfig } from 'axios';

// Generic API function to handle different request types
export const apiService = {
    get: async <T>(url: string, config?: AxiosRequestConfig) => {
        const response = await api.get<T>(url, config);
        return response.data;
    },

    post: async <T>(url: string, data?: any, config?: AxiosRequestConfig) => {
        const response = await api.post<T>(url, data, config);
        return response.data;
    },

    put: async <T>(url: string, data?: any, config?: AxiosRequestConfig) => {
        const response = await api.put<T>(url, data, config);
        return response.data;
    },

    patch: async <T>(url: string, data?: any, config?: AxiosRequestConfig) => {
        const response = await api.patch<T>(url, data, config);
        return response.data;
    },

    delete: async <T>(url: string, config?: AxiosRequestConfig) => {
        const response = await api.delete<T>(url, config);
        return response.data;
    },
};
