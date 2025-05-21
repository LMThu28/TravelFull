import axiosClient from "./axiosClient";
import axios from 'axios';

const userApi = {
    async getAllPersonalInfo() {
        const url = '/auth/getAll';
        try {
            const response = await axiosClient.get(url);
            console.log(response.data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    login(data) {
        const url = '/auth/login';
        return axiosClient
            .post(url, data)
            .then(response => {
                console.log(response);
                if (response.data.user.status !== "noactive") {
                    localStorage.setItem("token", response.data.user.token);
                    localStorage.setItem("user", JSON.stringify(response.data.user));
                }
                return response;
            });
    },


    register(data) {
        const url = '/auth/register';
        console.log(data);
        return axiosClient.post(url, data);
    },

    getProfile() {
        const url = '/user/profile';
        return axiosClient.get(url);
    },

    updateProfile(data, id) {
        const url = '/user/updateProfile/' + id;
        return axiosClient.put(url, data);
    },

    forgotPassword(data) {
        const url = '/auth/forgot-password';
        return axiosClient.post(url, data);
    },

    listUserByAdmin(data) {
        const url = '/user/search';
        return axiosClient.post(url, data);
    },

    banAccount(data, id) {
        const url = '/user/updateProfile/' + id;
        return axiosClient.put(url, data);
    },

    unBanAccount(data, id) {
        const url = '/user/updateProfile/' + id;
        return axiosClient.put(url, data);
    },

    searchUser(email) {
        console.log(email);
        const params = {
            email: email.target.value
        }
        const url = '/user/searchByEmail';
        return axiosClient.get(url, { params });
    },

    sendNotification(data) {
        console.log(data);
        const url = '/auth/notifications';
        return axiosClient.post(url, data);
    },

    createNotificationByEmail(data) {
        console.log(data);
        const url = '/notifications/createNotificationByEmail';
        return axiosClient.post(url, data);
    },

    listNotification() {
        const url = '/notifications';
        return axiosClient.get(url);
    },

    sendMessage(data) {
        const url = '/auth/send-message';
        return axiosClient.post(url, data);
    }
}

export default userApi;