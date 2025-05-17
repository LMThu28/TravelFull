import axiosClient from "./axiosClient";

const areaManagementApi = {
    async addArea(name, status) {
        try {
            const response = await axiosClient.post('/areas/add', { name, status });
            return response;
        } catch (error) {
            throw error;
        }
    },
    async updateArea(id, name, status) {
        try {
            const response = await axiosClient.put(`/areas/update/${id}`, { name, status });
            return response;
        } catch (error) {
            throw error;
        }
    },
    async deleteArea(id) {
        try {
            const response = await axiosClient.delete(`/areas/delete/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async getAreaById(id) {
        try {
            const response = await axiosClient.get(`/areas/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async getAllAreas() {
        try {
            const response = await axiosClient.get('/areas');
            return response;
        } catch (error) {
            throw error;
        }
    },
    async searchAreas(keyword) {
        try {
            const response = await axiosClient.get('/areas/search', { params: { keyword } });
            return response;
        } catch (error) {
            throw error;
        }
    }
};

export default areaManagementApi;
