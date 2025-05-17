import axiosClient from "./axiosClient";

const tourApi = {
    // Tour Categories
    async createTourCategory(data) {
        const url = '/tours/categories';
        try {
            const response = await axiosClient.post(url, data);
            console.log(response);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async getAllTourCategories() {
        const url = '/tours/categories';
        try {
            const response = await axiosClient.get(url);
            console.log(response);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async getTourCategoryById(id) {
        const url = `/tours/categories/${id}`;
        try {
            const response = await axiosClient.get(url);
            console.log(response);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async updateTourCategory(id, data) {
        const url = `/tours/categories/${id}`;
        try {
            const response = await axiosClient.put(url, data);
            console.log(response);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async deleteTourCategory(id) {
        const url = `/tours/categories/${id}`;
        try {
            const response = await axiosClient.delete(url);
            console.log(response);
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Tours
    async createTour(data) {
        const url = '/tours';
        try {
            const response = await axiosClient.post(url, data);
            console.log(response);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async getAllTours(page = 1, limit = 10) {
        const url = `/tours?page=${page}&limit=${limit}`;
        try {
            const response = await axiosClient.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async getTourById(id) {
        const url = `/tours/${id}`;
        try {
            const response = await axiosClient.get(url);
            console.log(response);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async updateTour(id, data) {
        const url = `/tours/${id}`;
        try {
            const response = await axiosClient.put(url, data);
            console.log(response);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async deleteTour(id) {
        const url = `/tours/${id}`;
        try {
            const response = await axiosClient.delete(url);
            console.log(response);
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Tour Schedules
    async createTourSchedule(data) {
        const url = '/tours/schedules';
        try {
            const response = await axiosClient.post(url, data);
            console.log(response);
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Tour Bookings
    async createTourBooking(data) {
        const url = '/tours/bookings';
        try {
            const response = await axiosClient.post(url, data);
            console.log(response);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async getUserTourBookings(userId) {
        const url = `/tours/bookings/user/${userId}`;
        try {
            const response = await axiosClient.get(url);
            console.log(response);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async updateTourBookingStatus(id, data) {
        const url = `/tours/bookings/${id}`;
        try {
            const response = await axiosClient.patch(url, data);
            console.log(response);
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Additional utility methods
    async getToursByCategory(categoryId) {
        const url = `/tours/category/${categoryId}`;
        try {
            const response = await axiosClient.get(url);
            console.log(response);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async getTourSchedules(tourId) {
        const url = `/tours/${tourId}/schedules`;
        try {
            const response = await axiosClient.get(url);
            console.log(response);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async getTourRevenue(startDate, endDate) {
        const url = `/tours/revenue?start_date=${startDate}&end_date=${endDate}`;
        try {
            const response = await axiosClient.get(url);
            console.log(response);
            return response;
        } catch (error) {
            throw error;
        }
    }
};

export default tourApi; 