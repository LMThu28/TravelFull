import axiosClient from '../apis/axiosClient';

const roomsApiService = {
    getAllRooms: async () => {
        try {
            const response = await axiosClient.get('/rooms');
            return response.data;
        } catch (error) {
            console.error('Error fetching rooms:', error);
            throw error;
        }
    },

    getRoomById: async (id) => {
        try {
            const response = await axiosClient.get(`/rooms/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching room by ID:', error);
            throw error;
        }
    },

    createRoom: async (roomData) => {
        try {
            const response = await axiosClient.post('/rooms', roomData);
            return response.data;
        } catch (error) {
            console.error('Error creating room:', error);
            throw error;
        }
    },

    updateRoom: async (id, roomData) => {
        try {
            const response = await axiosClient.put(`/rooms/${id}`, roomData);
            return response.data;
        } catch (error) {
            console.error('Error updating room:', error);
            throw error;
        }
    },

    deleteRoom: async (id) => {
        try {
            const response = await axiosClient.delete(`/rooms/${id}`);
            return response;
        } catch (error) {
            console.error('Error deleting room:', error);
            throw error;
        }
    },

    searchRooms: async (query) => {
        try {
            const response = await axiosClient.get(`/rooms/search?query=${query}`);
            return response.data;
        } catch (error) {
            console.error('Error searching rooms:', error);
            throw error;
        }
    }
};

export default roomsApiService; 