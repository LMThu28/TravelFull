import axiosClient from './axiosClient';

const productTypeAPI = {
  async addProductType(name, status) {
    try {
      const response = await axiosClient.post('/product-types/add', { name, status });
      return response;
    } catch (error) {
      throw error;
    }
  },
  async updateProductType(id, name, status) {
    try {
      const response = await axiosClient.put(`/product-types/update/${id}`, { name, status });
      return response;
    } catch (error) {
      throw error;
    }
  },
  async deleteProductType(id) {
    try {
      const response = await axiosClient.delete(`/product-types/delete/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async getProductTypeById(id) {
    try {
      const response = await axiosClient.get(`/product-types/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async getAllProductTypes() {
    try {
      const response = await axiosClient.get('/product-types');
      return response;
    } catch (error) {
      throw error;
    }
  },
  async searchProductTypes(keyword) {
    try {
      const response = await axiosClient.get('/product-types/search', { params: { keyword } });
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default productTypeAPI;
