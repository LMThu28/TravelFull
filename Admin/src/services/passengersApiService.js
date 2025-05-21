import axiosClient from '../apis/axiosClient';

const passengersApiService = {
    getAllPassengers: async () => {
        try {
            const response = await axiosClient.get('/passengers');
            return response.data;
        } catch (error) {
            console.error('Error fetching passengers:', error);
            throw error;
        }
    },

    getPassengerById: async (id) => {
        try {
            const response = await axiosClient.get(`/passengers/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching passenger by ID:', error);
            throw error;
        }
    },

    createPassenger: async (passengerData) => {
        try {
            const response = await axiosClient.post('/passengers', passengerData);
            return response.data;
        } catch (error) {
            console.error('Error creating passenger:', error);
            throw error;
        }
    },

    updatePassenger: async (id, passengerData) => {
        try {
            const response = await axiosClient.put(`/passengers/${id}`, passengerData);
            return response.data;
        } catch (error) {
            console.error('Error updating passenger:', error);
            throw error;
        }
    },

    deletePassenger: async (id) => {
        try {
            const response = await axiosClient.delete(`/passengers/${id}`);
            return response;
        } catch (error) {
            console.error('Error deleting passenger:', error);
            throw error;
        }
    },

    searchPassengers: async (query) => {
        try {
            const response = await axiosClient.get(`/passengers/search?query=${query}`);
            return response.data;
        } catch (error) {
            console.error('Error searching passengers:', error);
            throw error;
        }
    },

    getPassengersByUserId: async (userId) => {
        try {
            const response = await axiosClient.get(`/passengers/user/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching passengers by user ID:', error);
            throw error;
        }
    }
};

export default passengersApiService; 