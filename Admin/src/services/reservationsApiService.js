import axiosClient from '../apis/axiosClient';

const reservationsApiService = {
    // reservationsApiService
    getReservationRevenueStats: async (period) => {
        try {
            const response = await axiosClient.get(`/reservations/stats/revenue?period=${period}`);
            return response;
        } catch (error) {
            console.error('Error fetching reservation revenue stats:', error);
            throw error;
        }
    },
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
            return response.data;
        } catch (error) {
            console.error('Error creating reservation:', error);
            throw error;
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

    updateReservationStatus: async (id, status) => {
        // ... existing updateReservationStatus ...
    },

    // --- Reservation Statistics ---
    getReservationStats: async () => {
        try {
            const response = await axiosClient.get('/reservations/stats');
            // Assuming response structure is { success: true, data: { totalReservations: ..., statusCounts: {...}, totalConfirmedRevenue: ... }, message: '...' }
            return response.data;
        } catch (error) {
            console.error('Error fetching reservation stats:', error);
            throw error;
        }
    },
};

export default reservationsApiService; 