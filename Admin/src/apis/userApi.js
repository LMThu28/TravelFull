import axiosClient from "./axiosClient";

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

    login(email, password) {
        const url = '/auth/login';
        return axiosClient
            .post(url, {
                email,
                password,
            })
            .then(response => {
                if (response?.data?.user) {
                    localStorage.setItem("token", response.data.token);
                    localStorage.setItem("user", JSON.stringify(response.data.user));
                }
                console.log(response);

                return response;
            });
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
        const url = '/user/';
        return axiosClient.get(url);
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

    getProfileById(id) {
        const url = `/user/profile/${id}`;
        return axiosClient.get(url);
    }
}

export default userApi;