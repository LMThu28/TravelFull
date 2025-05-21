import axiosClient from '../apis/axiosClient';

const categoriesApiService = {
    getAllCategories: async () => {
        try {
            const response = await axiosClient.get('/categories');
            return response.data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    },

    getCategoryById: async (id) => {
        try {
            const response = await axiosClient.get(`/categories/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching category by ID:', error);
            throw error;
        }
    },

    createCategory: async (categoryData) => {
        try {
            const response = await axiosClient.post('/categories', categoryData);
            return response.data;
        } catch (error) {
            console.error('Error creating category:', error);
            throw error;
        }
    },

    updateCategory: async (id, categoryData) => {
        try {
            const response = await axiosClient.put(`/categories/${id}`, categoryData);
            return response.data;
        } catch (error) {
            console.error('Error updating category:', error);
            throw error;
        }
    },

    deleteCategory: async (id) => {
        try {
            const response = await axiosClient.delete(`/categories/${id}`);
            return response;
        } catch (error) {
            console.error('Error deleting category:', error);
            throw error;
        }
    },

    searchCategories: async (query) => {
        try {
            const response = await axiosClient.get(`/categories/search?query=${query}`);
            return response.data;
        } catch (error) {
            console.error('Error searching categories:', error);
            throw error;
        }
    }
};

export default categoriesApiService; 