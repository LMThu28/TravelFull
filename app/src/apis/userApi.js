import axiosClient from "./axiosClient";
import AsyncStorage from '@react-native-async-storage/async-storage';

const userApi = {
    async getAllPersonalInfo() {
        const url = '/auth/getAll';
        try {
            const response = await axiosClient.get(url);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async login(data) {
        const url = '/auth/login';
        try {
            const response = await axiosClient.post(url, data);
            if (response.user && response.user.status !== "noactive") {
                await AsyncStorage.setItem("token", response.user.token);
                await AsyncStorage.setItem("user", JSON.stringify(response.user));
            }
            return response;
        } catch (error) {
            throw error;
        }
    },

    async register(data) {
        const url = '/auth/register';
        try {
            const response = await axiosClient.post(url, data);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async getProfile() {
        const url = '/user/profile';
        try {
            const response = await axiosClient.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async updateProfile(data, id) {
        const url = '/user/updateProfile/' + id;
        try {
            const response = await axiosClient.put(url, data);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async forgotPassword(data) {
        const url = '/auth/forgot-password';
        try {
            const response = await axiosClient.post(url, data);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async logout() {
        try {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('user');
        } catch (error) {
            throw error;
        }
    },

    async searchUser(email) {
        const url = '/user/searchByEmail';
        try {
            const response = await axiosClient.get(url, { 
                params: { email } 
            });
            return response;
        } catch (error) {
            throw error;
        }
    },

    async listNotification() {
        const url = '/notifications';
        try {
            const response = await axiosClient.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async sendMessage(data) {
        const url = '/auth/send-message';
        try {
            const response = await axiosClient.post(url, data);
            return response;
        } catch (error) {
            throw error;
        }
    }
};

export default userApi; 