import axiosClient from '../apis/axiosClient';

const reservationsApiService = {
    getAllReservations: async () => {
        try {
            const response = await axiosClient.get('/reservations');
            return response.data;
        } catch (error) {
            console.error('Error fetching reservations:', error);
            throw error;
        }
    },

    getReservationById: async (id) => {
        try {
            const response = await axiosClient.get(`/reservations/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching reservation by ID:', error);
            throw error;
        }
    },

    createReservation: async (reservationData) => {
        try {
            const response = await axiosClient.post('/reservations', reservationData);
            return response;
        } catch (error) {
            console.error('Error creating reservation:', error);
            return error;
        }
    },

    updateReservation: async (id, reservationData) => {
        try {
            const response = await axiosClient.put(`/reservations/${id}`, reservationData);
            return response.data;
        } catch (error) {
            console.error('Error updating reservation:', error);
            throw error;
        }
    },

    deleteReservation: async (id) => {
        try {
            const response = await axiosClient.delete(`/reservations/${id}`);
            return response;
        } catch (error) {
            console.error('Error deleting reservation:', error);
            throw error;
        }
    },

    searchReservations: async (query) => {
        try {
            const response = await axiosClient.get(`/reservations/search?query=${query}`);
            return response.data;
        } catch (error) {
            console.error('Error searching reservations:', error);
            throw error;
        }
    },

    getReservationsByUserId: async (userId) => {
        try {
            const response = await axiosClient.get(`/reservations/user/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching reservations by user ID:', error);
            throw error;
        }
    },

    updateReservationStatus: async (id, statusData) => {
        try {
            const response = await axiosClient.put(`/reservations/${id}/status`, statusData);
            return response.data;
        } catch (error) {
            console.error('Error updating reservation status:', error);
            throw error;
        }
    },
};

export default reservationsApiService; 