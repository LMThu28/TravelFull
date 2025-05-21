import axiosClient from './axiosClient';

const tournamentResultApi = {
  async addTournamentResult(data) {
    try {
      const response = await axiosClient.post('/tournament-results', data);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async updateTournamentResult(data, id) {
    try {
      const response = await axiosClient.put(`/tournament-results/${id}`, data);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async deleteTournamentResult(id) {
    try {
      const response = await axiosClient.delete(`/tournament-results/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async getTournamentResultById(id) {
    try {
      const response = await axiosClient.get(`/tournament-results/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async getAllTournamentResults() {
    try {
      const response = await axiosClient.get('/tournament-results');
      return response;
    } catch (error) {
      throw error;
    }
  },
  async searchTournamentResults(keyword) {
    try {
      const response = await axiosClient.get('/tournament-results/search', { params: { keyword } });
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default tournamentResultApi;
