import axiosClient from './axiosClient';

const tournamentApi = {
  async addTournament(data) {
    try {
      const response = await axiosClient.post('/tournaments', data);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async updateTournament(data, id) {
    try {
      const response = await axiosClient.put(`/tournaments/${id}`, data);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async deleteTournament(id) {
    try {
      const response = await axiosClient.delete(`/tournaments/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async getTournamentById(id) {
    try {
      const response = await axiosClient.get(`/tournaments/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async getTournamentByUserId(id) {
    try {
      const response = await axiosClient.get(`/tournaments/user/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async getAllTournaments() {
    try {
      const response = await axiosClient.get('/tournaments');
      return response;
    } catch (error) {
      throw error;
    }
  },
  async searchTournaments(keyword) {
    try {
      const response = await axiosClient.get('/tournaments/search', { params: { keyword } });
      return response;
    } catch (error) {
      throw error;
    }
  },
  async approveTournament(id, approval_status) {
    try {
      const response = await axiosClient.put(`/tournaments/${id}/approve`, { approval_status });
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default tournamentApi;
