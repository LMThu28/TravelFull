import axiosClient from './axiosClient';

const API_BASE_URL = '/services';

// Service API functions
const serviceApi = {
    async getAllServices() {
        try {
            const response = await axiosClient.get(API_BASE_URL);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async getServiceById(id) {
        try {
            const response = await axiosClient.get(`${API_BASE_URL}/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async createService(serviceData) {
        try {
            const response = await axiosClient.post(API_BASE_URL, serviceData);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async updateService(id, serviceData) {
        try {
            const response = await axiosClient.put(`${API_BASE_URL}/${id}`, serviceData);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async deleteService(id) {
        try {
            const response = await axiosClient.delete(`${API_BASE_URL}/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async searchServices(name) {
        try {
            const response = await axiosClient.get(`${API_BASE_URL}/search`, { params: { query: name } });
            return response;
        } catch (error) {
            throw error;
        }
    },
    async getServicesByCategoryId(categoryId) {
        try {
            const response = await axiosClient.get(`${API_BASE_URL}/category/${categoryId}`);
            return response;
        } catch (error) {
            throw error;
        }
    }
};

export default serviceApi;