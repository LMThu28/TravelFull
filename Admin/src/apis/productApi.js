import axiosClient from './axiosClient';

const productAPI = {
  async addProduct(data) {
    try {
      const response = await axiosClient.post('/products/add', data);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async updateProduct(data, id) {
    try {
      const response = await axiosClient.put(`/products/update/${id}`, data);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async deleteProduct(id) {
    try {
      const response = await axiosClient.delete(`/products/delete/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async getProductById(id) {
    try {
      const response = await axiosClient.get(`/products/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async getProductByUserId(id) {
    try {
      const response = await axiosClient.get(`/products/user/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async getAllProducts() {
    try {
      const response = await axiosClient.get('/products');
      return response;
    } catch (error) {
      throw error;
    }
  },
  async searchProducts(keyword) {
    try {
      const response = await axiosClient.get('/products/search', { params: { keyword } });
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default productAPI;
