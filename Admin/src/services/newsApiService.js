import axiosClient from '../apis/axiosClient';

const newsApiService = {
    getAllNews: async () => {
        try {
            const response = await axiosClient.get('/news');
            return response.data;
        } catch (error) {
            console.error('Error fetching news:', error);
            throw error;
        }
    },

    getNewsById: async (id) => {
        try {
            const response = await axiosClient.get(`/news/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching news by ID:', error);
            throw error;
        }
    },

    createNews: async (newsData) => {
        try {
            const response = await axiosClient.post('/news', newsData);
            return response.data;
        } catch (error) {
            console.error('Error creating news:', error);
            throw error;
        }
    },

    updateNews: async (id, newsData) => {
        try {
            const response = await axiosClient.put(`/news/${id}`, newsData);
            return response.data;
        } catch (error) {
            console.error('Error updating news:', error);
            throw error;
        }
    },

    deleteNews: async (id) => {
        try {
            const response = await axiosClient.delete(`/news/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting news:', error);
            throw error;
        }
    },

    searchNews: async (query) => {
        try {
            const response = await axiosClient.get(`/news/search?query=${query}`);
            return response.data;
        } catch (error) {
            console.error('Error searching news:', error);
            throw error;
        }
    }
};

export default newsApiService; 