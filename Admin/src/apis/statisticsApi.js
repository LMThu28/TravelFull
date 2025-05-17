import axiosClient from './axiosClient';

const statisticsApi = {
  async getAllStatistics(id) {
    try {
      const response = await axiosClient.get('/statistics/'+ id);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default statisticsApi;
