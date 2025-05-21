import axiosClient from './axiosClient';

const newsApi = {
    createNews(data) {
        const url = '/news'; // Corrected endpoint based on typical REST patterns
        return axiosClient.post(url, data);
    },
    getDetailNews(id) {
        const url = '/news/' + id;
        return axiosClient.get(url);
    },
    getListNews(params) { // Allow passing pagination or filter params
        const url = '/news';
        return axiosClient.get(url, { params });
    },
    deleteNews(id) {
        const url = "/news/" + id;
        return axiosClient.delete(url);
    },
    searchNews(query) {
        const params = {
            // Assuming backend expects 'q' or 'query' for search term
            // Adjust if your backend uses a different parameter name
            query: query 
        }
        // The search endpoint might be /news or /news/search depending on your backend
        const url = '/news/search'; // Or just '/news' if backend handles search on the main endpoint
        return axiosClient.get(url, { params });
    },
    updateNews(id, data) { // Added updateNews function
        const url = `/news/${id}`;
        return axiosClient.put(url, data);
    }
}

export default newsApi; 