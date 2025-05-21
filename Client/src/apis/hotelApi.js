import axiosClient from "./axiosClient";

const hotelApi = {
    async getAllHotels() {
        const url = '/hotels';
        try {
            const response = await axiosClient.get(url);
            console.log(response);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async getHotelById(id) {
        const url = `/hotels/${id}`;
        try {
            const response = await axiosClient.get(url);
            console.log(response);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async createHotel(data) {
        const url = '/hotels';
        try {
            const response = await axiosClient.post(url, data);
            console.log(response);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async updateHotel(id, data) {
        const url = `/hotels/${id}`;
        try {
            const response = await axiosClient.put(url, data);
            console.log(response);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async deleteHotel(id) {
        const url = `/hotels/${id}`;
        try {
            const response = await axiosClient.delete(url);
            console.log(response);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async searchHotels(query) {
        const url = `/hotels/search?query=${encodeURIComponent(query)}`;
        try {
            const response = await axiosClient.get(url);
            console.log(response);
            return response;
        } catch (error) {
            throw error;
        }
    }
};

export default hotelApi;
