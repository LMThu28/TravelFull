import axios from 'axios';

const getAllRecommendations = async () => {
    const response = await axios.get('/api/recommendations'); // Adjust the endpoint as needed
    return response.data;
};

export default {
    getAllRecommendations,
}; 