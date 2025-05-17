import axiosClient from '../apis/axiosClient';

const hotelsApiService = {
    getAllHotels: async () => {
        try {
            const response = await axiosClient.get('/hotels');
            return response.data;
        } catch (error) {
            console.error('Error fetching hotels:', error);
            throw error;
        }
    },

    getHotelById: async (id) => {
        try {
            const response = await axiosClient.get(`/hotels/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching hotel by ID:', error);
            throw error;
        }
    },

    createHotel: async (hotelData) => {
        try {
            const response = await axiosClient.post('/hotels', hotelData);
            return response.data;
        } catch (error) {
            console.error('Error creating hotel:', error);
            throw error;
        }
    },

    updateHotel: async (id, hotelData) => {
        try {
            const response = await axiosClient.put(`/hotels/${id}`, hotelData);
            return response.data;
        } catch (error) {
            console.error('Error updating hotel:', error);
            throw error;
        }
    },

    deleteHotel: async (id) => {
        try {
            const response = await axiosClient.delete(`/hotels/${id}`);
            return response;
        } catch (error) {
            console.error('Error deleting hotel:', error);
            throw error;
        }
    },

    searchHotels: async (query) => {
        try {
            const response = await axiosClient.get(`/hotels/search?query=${query}`);
            return response.data;
        } catch (error) {
            console.error('Error searching hotels:', error);
            throw error;
        }
    }
};

export default hotelsApiService; 