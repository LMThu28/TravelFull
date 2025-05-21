import axiosClient from "./axiosClient";

const courtsManagementApi = {
    async addCourt(data) {
        try {
            const response = await axiosClient.post('/courts/add', data);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async updateCourt(data,id) {
        try {
            const response = await axiosClient.put(`/courts/update/${id}`, data);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async deleteCourt(id) {
        try {
            const response = await axiosClient.delete(`/courts/delete/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async getCourtById(id) {
        try {
            const response = await axiosClient.get(`/courts/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async getCourtByUserId(id) {
        try {
            const response = await axiosClient.get(`/courts/user/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async getAllCourts() {
        try {
            const response = await axiosClient.get('/courts');
            return response;
        } catch (error) {
            throw error;
        }
    },
    async searchCourts(keyword) {
        try {
            const response = await axiosClient.get('/courts/search', { params: { keyword } });
            return response;
        } catch (error) {
            throw error;
        }
    },
    async updateApprovalStatus(id, approval_status) {
        try {
            const response = await axiosClient.put(`/courts/${id}/update-approval-status`, { approval_status });
            return response;
        } catch (error) {
            throw error;
        }
    }
};

export default courtsManagementApi;
