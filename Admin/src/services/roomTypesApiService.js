import axiosClient from '../apis/axiosClient';

const roomTypesApiService = {
    getAllRoomTypes: async () => {
        try {
            const response = await axiosClient.get('/room-types');
            return response.data;
        } catch (error) {
            console.error('Error fetching room types:', error);
            throw error;
        }
    },

    getRoomTypeById: async (id) => {
        try {
            const response = await axiosClient.get(`/room-types/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching room type by ID:', error);
            throw error;
        }
    },

    createRoomType: async (roomTypeData) => {
        try {
            const response = await axiosClient.post('/room-types', roomTypeData);
            return response.data;
        } catch (error) {
            console.error('Error creating room type:', error);
            throw error;
        }
    },

    updateRoomType: async (id, roomTypeData) => {
        try {
            const response = await axiosClient.put(`/room-types/${id}`, roomTypeData);
            return response.data;
        } catch (error) {
            console.error('Error updating room type:', error);
            throw error;
        }
    },

    deleteRoomType: async (id) => {
        try {
            const response = await axiosClient.delete(`/room-types/${id}`);
            return response;
        } catch (error) {
            console.error('Error deleting room type:', error);
            throw error;
        }
    },

    searchRoomTypes: async (query) => {
        try {
            const response = await axiosClient.get(`/room-types/search?query=${query}`);
            return response.data;
        } catch (error) {
            console.error('Error searching room types:', error);
            throw error;
        }
    }
};

export default roomTypesApiService; 