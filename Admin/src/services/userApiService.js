import axiosClient from '../apis/axiosClient';

const userApiService = {
    // Fetch user data from the server
    fetchUser: async (userId) => {
        try {
            const response = await axiosClient.get(`/users/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user:', error);
            throw error;
        }
    },

    // Update user data on the server
    updateUser: async (userId, userData) => {
        try {
            const response = await axiosClient.put(`/users/${userId}`, userData);
            return response.data;
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    },

    // Delete user data from the server
    deleteUser: async (userId) => {
        try {
            const response = await axiosClient.delete(`/users/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    },

    // Create a new user on the server
    createUser: async (userData) => {
        try {
            const response = await axiosClient.post('/users', userData);
            return response.data;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    },

    // Search users on the server
    searchUsers: async (query) => {
        try {
            const response = await axiosClient.get(`/users/search?query=${query}`);
            return response.data;
        } catch (error) {
            console.error('Error searching users:', error);
            throw error;
        }
    }
};

export default userApiService; 