import axiosClient from '../apis/axiosClient';

const flightsApiService = {
    getAllFlights: async () => {
        try {
            const response = await axiosClient.get('/flights');
            return response.data;
        } catch (error) {
            console.error('Error fetching flights:', error);
            throw error;
        }
    },

    getFlightById: async (id) => {
        try {
            const response = await axiosClient.get(`/flights/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching flight by ID:', error);
            throw error;
        }
    },

    createFlight: async (flightData) => {
        try {
            const response = await axiosClient.post('/flights', flightData);
            return response.data;
        } catch (error) {
            console.error('Error creating flight:', error);
            throw error;
        }
    },

    updateFlight: async (id, flightData) => {
        try {
            const response = await axiosClient.put(`/flights/${id}`, flightData);
            return response.data;
        } catch (error) {
            console.error('Error updating flight:', error);
            throw error;
        }
    },

    deleteFlight: async (id) => {
        try {
            const response = await axiosClient.delete(`/flights/${id}`);
            return response;
        } catch (error) {
            console.error('Error deleting flight:', error);
            throw error;
        }
    },

    searchFlights: async (query) => {
        try {
            const response = await axiosClient.get(`/flights/search?query=${query}`);
            return response.data;
        } catch (error) {
            console.error('Error searching flights:', error);
            throw error;
        }
    }
};

export default flightsApiService; 