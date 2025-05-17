import axiosClient from '../apis/axiosClient';

const bookingsApiService = {
    getAllBookings: async () => {
        try {
            const response = await axiosClient.get('/bookings');
            return response.data;
        } catch (error) {
            console.error('Error fetching bookings:', error);
            throw error;
        }
    },

    getBookingById: async (id) => {
        try {
            const response = await axiosClient.get(`/bookings/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching booking by ID:', error);
            throw error;
        }
    },

    createBooking: async (bookingData) => {
        try {
            const response = await axiosClient.post('/bookings', bookingData);
            return response.data;
        } catch (error) {
            console.error('Error creating booking:', error);
            throw error;
        }
    },

    updateBooking: async (id, bookingData) => {
        try {
            const response = await axiosClient.put(`/bookings/${id}`, bookingData);
            return response.data;
        } catch (error) {
            console.error('Error updating booking:', error);
            throw error;
        }
    },

    deleteBooking: async (id) => {
        try {
            const response = await axiosClient.delete(`/bookings/${id}`);
            return response;
        } catch (error) {
            console.error('Error deleting booking:', error);
            throw error;
        }
    },

    searchBookings: async (query) => {
        try {
            const response = await axiosClient.get(`/bookings/search?query=${query}`);
            return response.data;
        } catch (error) {
            console.error('Error searching bookings:', error);
            throw error;
        }
    }
};

export default bookingsApiService; 