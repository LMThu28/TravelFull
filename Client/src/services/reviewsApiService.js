import axiosClient from '../apis/axiosClient';

const reviewsApiService = {
    addReview: async (reviewData) => {
        try {
            const response = await axiosClient.post('/reviews', reviewData);
            return response.data;
        } catch (error) {
            console.error('Error adding review:', error);
            throw error;
        }
    },

    updateReview: async (reviewId, reviewData) => {
        try {
            const response = await axiosClient.put(`/reviews/${reviewId}`, reviewData);
            return response.data;
        } catch (error) {
            console.error('Error updating review:', error);
            throw error;
        }
    },

    deleteReview: async (reviewId) => {
        try {
            const response = await axiosClient.delete(`/reviews/${reviewId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting review:', error);
            throw error;
        }
    },

    getAllReviews: async () => {
        try {
            const response = await axiosClient.get('/reviews');
            return response;
        } catch (error) {
            console.error('Error fetching all reviews:', error);
            throw error;
        }
    },

    getReviewById: async (reviewId) => {
        try {
            const response = await axiosClient.get(`/reviews/${reviewId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching review by ID:', error);
            throw error;
        }
    },

    getHotelReviewsStats: async (hotelId) => {
        try {
            const response = await axiosClient.get(`/reviews/stats/${hotelId}`);
            return response;
        } catch (error) {
            console.error('Error fetching hotel reviews stats:', error);
            throw error;
        }
    }
};

export default reviewsApiService;