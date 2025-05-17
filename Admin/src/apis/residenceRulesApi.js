import axiosClient from "./axiosClient";

const residenceRules = {
    async listResidenceRules() {
        const url = 'residence-rules';
        try {
            const response = await axiosClient.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async createResidenceRule(data) {
        const url = 'residence-rules';
        try {
            const response = await axiosClient.post(url, data);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async updateResidenceRule(data, id) {
        const url = 'residence-rules/' + id;
        try {
            const response = await axiosClient.put(url, data);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async searchResidenceRule(name) {
        const url = 'residence-rules/search?query=' + name.target.value;
        try {
            const response = await axiosClient.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async deleteResidenceRule(id) {
        const url = 'residence-rules/' + id;
        try {
            const response = await axiosClient.delete(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async getDetailResidenceRule(id) {
        const url = 'residence-rules/' + id;
        try {
            const response = await axiosClient.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },  
}

export default residenceRules;
