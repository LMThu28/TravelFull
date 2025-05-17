import axiosClient from "./axiosClient";

const employeeApi = {
    async addEmployee(data) {
        const url = '/employee/addEmployee';
        try {
            const response = await axiosClient.post(url, data);
            console.log(response.data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async updateEmployee(data, id) {
        const url = `/employee/updateEmployee/${id}`;
        try {
            const response = await axiosClient.put(url, data);
            console.log(response.data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async deleteEmployee(id) {
        const url = `/employee/deleteEmployee/${id}`;
        try {
            const response = await axiosClient.delete(url);
            console.log(response.data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async getAllEmployees() {
        const url = '/employee/getAllEmployees';
        try {
            const response = await axiosClient.get(url);
            console.log(response.data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async getEmployeeById(id) {
        const url = `/employee/getEmployeeById/${id}`;
        try {
            const response = await axiosClient.get(url);
            console.log(response.data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async getEmployeeByUserId(userId) {
        const url = `/employee/getEmployeeByUserId/${userId}`;
        try {
            const response = await axiosClient.get(url);
            console.log(response.data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    banAccount(data, id) {
        const url = '/employee/updateEmployee/' + id;
        return axiosClient.put(url, data);
    },

    unBanAccount(data, id) {
        const url = '/employee/updateEmployee/' + id;
        return axiosClient.put(url, data);
    },
};

export default employeeApi;
