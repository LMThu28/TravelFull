import axiosClient from "./axiosClient";

const fieldTypesApi = {
    async addFieldType(type, status) {
        try {
            const response = await axiosClient.post('/field-types/add', { type, status });
            return response;
        } catch (error) {
            throw error;
        }
    },
    async updateFieldType(id, type, status) {
        try {
            const response = await axiosClient.put(`/field-types/update/${id}`, { type, status });
            return response;
        } catch (error) {
            throw error;
        }
    },
    async deleteFieldType(id) {
        try {
            const response = await axiosClient.delete(`/field-types/delete/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async getFieldTypeById(id) {
        try {
            const response = await axiosClient.get(`/field-types/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async getAllFieldTypes() {
        try {
            const response = await axiosClient.get('/field-types');
            return response;
        } catch (error) {
            throw error;
        }
    },
    async searchFieldTypes(keyword) {
        try {
            const response = await axiosClient.get('/field-types/search', { params: { keyword } });
            return response;
        } catch (error) {
            throw error;
        }
    }
};

export default fieldTypesApi;
