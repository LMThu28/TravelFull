import axiosClient from "./axiosClient";

const assetManagementApi = {
    async listAssetManagement() {
        const url = 'assets';
        try {
            const response = await axiosClient.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async listAssetReports(id) {
        const url = 'assets/' + id + "/reports";
        try {
            const response = await axiosClient.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async getAssetStatistics(year, month) {
        const url = `statistics?year=${year}&month=${month}`;
        try {
            const response = await axiosClient.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async createAssetManagement(data) {
        const url = 'assets';
        try {
            const response = await axiosClient.post(url, data);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async createAssetReports(data) {
        const url = 'assets/reports';
        try {
            const response = await axiosClient.post(url, data);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async updateAssetManagement(data, id) {
        const url = 'assets/' + id;
        try {
            const response = await axiosClient.put(url, data);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async searchAssetManagement(name) {
        const url = 'assets/search?keyword=' + name.target.value;
        try {
            const response = await axiosClient.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async deleteAssetManagement(id) {
        const url = 'assets/' + id;
        try {
            const response = await axiosClient.delete(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async getDetailAssetManagement(id) {
        const url = 'assets/' + id;
        try {
            const response = await axiosClient.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async searchAssetsByName(name) {
        const url = 'assets/searchAssetReport?name=' + name.target.value;
        try {
            const response = await axiosClient.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async banAccount(id) {
        const url = 'assets/approve/' + id;
        return await axiosClient.put(url);
    },

    async unBanAccount(id) {
        const url = 'assets/unapprove/' + id;
        return await axiosClient.put(url);
    },

    async getListByUser(id) {
        const url = 'assets/createdby/' + id;
        return await axiosClient.get(url);
    },

    async registerAsset(id) {
        const url = 'assets/register/' + id;
        return await axiosClient.post(url);
    },

    async unregisterAsset(id) {
        const url = 'assets/unregister/' + id;
        return await axiosClient.delete(url);
    },

    async listParticipants(id) {
        const url = 'assets/participants/' + id;
        return await axiosClient.get(url);
    },

    async listUserEvents(id) {
        const url = 'assets/users/assets/' + id;
        return await axiosClient.get(url);
    },

    async uploadSubmissionFile(assetId, userId, submissionFile) {
        const url = `assets/uploadSubmissionFile`;
        try {
            const response = await axiosClient.post(url, { assetId, userId, submissionFile });
            return response;
        } catch (error) {
            throw error;
        }
    },
    
    async submitSubmissionComment(assetId, userId, submissionComment) {
        const url = `assets/submitSubmissionComment`;
        try {
            const response = await axiosClient.post(url, { assetId, userId, submissionComment });
            return response;
        } catch (error) {
            throw error;
        }
    },
    
}

export default assetManagementApi;
