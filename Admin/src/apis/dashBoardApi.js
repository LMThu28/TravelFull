import axiosClient from "./axiosClient";

const dashBoardApi = {
    async getAssetStatistics() {
        const url = `dashboard/statistics`;
        try {
            const response = await axiosClient.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    }, 
}

export default dashBoardApi;
