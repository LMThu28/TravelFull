import axiosClient from '../apis/axiosClient';

const airportsApiService = {
    getAllAirports: async () => {
        try {
            const response = await axiosClient.get('/airports');
            return response.data;
        } catch (error) {
            console.error('Error fetching airports:', error);
            throw error;
        }
    },

    getAirportById: async (id) => {
        try {
            const response = await axiosClient.get(`/airports/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching airport by ID:', error);
            throw error;
        }
    },

    createAirport: async (airportData) => {
        try {
            const response = await axiosClient.post('/airports', airportData);
            return response.data;
        } catch (error) {
            console.error('Error creating airport:', error);
            throw error;
        }
    },

    updateAirport: async (id, airportData) => {
        try {
            const response = await axiosClient.put(`/airports/${id}`, airportData);
            return response.data;
        } catch (error) {
            console.error('Error updating airport:', error);
            throw error;
        }
    },

    deleteAirport: async (id) => {
        try {
            const response = await axiosClient.delete(`/airports/${id}`);
            return response;
        } catch (error) {
            console.error('Error deleting airport:', error);
            throw error;
        }
    },

    searchAirports: async (query) => {
        try {
            const response = await axiosClient.get(`/airports/search?query=${query}`);
            return response.data;
        } catch (error) {
            console.error('Error searching airports:', error);
            throw error;
        }
    }
};

export default airportsApiService; 