import axiosClient from '../apis/axiosClient'; // Use axiosClient like in roomTypesApiService

const tourApiService = {
    // --- Tour Statistics --- 
    getTourStats: async () => {
        try {
            const response = await axiosClient.get('/tours/stats');
            return response.data; // Assuming stats are in response.data.data based on backend controller
        } catch (error) {
            console.error('Error fetching tour stats:', error);
            throw error;
        }
    },

    getTourRevenueStats: async (period) => { // Changed to async function
        try {
            const response = await axiosClient.get(`/tours/stats/revenue?period=${period}`); // Use axiosClient instead of axios
            return response; // Assuming stats are in response.data
        } catch (error) {
            console.error('Error fetching tour revenue stats:', error);
            throw error;
        }
    },

    // --- Tour CRUD --- 
    getAllTours: async (page = 1, limit = 10) => { // Add pagination params
        try {
            const response = await axiosClient.get(`/tours?page=${page}&limit=${limit}`);
            return response.data; // Usually returns { success, data: { tours, pagination }, message }
        } catch (error) {
            console.error('Error fetching tours:', error);
            throw error;
        }
    },

    getTourById: async (id) => {
        try {
            const response = await axiosClient.get(`/tours/${id}`);
            return response.data; // Usually returns { success, data: tour, message }
        } catch (error) {
            console.error('Error fetching tour by ID:', error);
            throw error;
        }
    },

    createTour: async (tourData) => {
        try {
            const response = await axiosClient.post('/tours', tourData);
            return response.data; // Usually returns { success, data: newTour, message }
        } catch (error) {
            console.error('Error creating tour:', error);
            throw error;
        }
    },

    updateTour: async (id, tourData) => {
        try {
            const response = await axiosClient.put(`/tours/${id}`, tourData);
            return response.data; // Usually returns { success, data: updatedTour, message }
        } catch (error) {
            console.error('Error updating tour:', error);
            throw error;
        }
    },

    deleteTour: async (id) => {
        try {
            const response = await axiosClient.delete(`/tours/${id}`);
            return response.data; // Usually returns { success, message }
        } catch (error) {
            console.error('Error deleting tour:', error);
            throw error;
        }
    },

    // --- Tour Category CRUD --- (Add if needed)
    // getAllTourCategories, createTourCategory, etc.

    // --- Tour Schedule CRUD --- (Add if needed)
    // getAllTourSchedules, createTourSchedule, etc.

    // --- Tour Booking CRUD --- (Add if needed)
    // getAllTourBookings, updateBookingStatus, etc.
};

export default tourApiService; 