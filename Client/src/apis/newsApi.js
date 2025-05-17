import axiosClient from './axiosClient';

const newsApi = {
    /*Danh sách api category */

    createNews(data) {
        const url = '/news/search';
        return axiosClient.post(url, data);
    },
    getDetailNews(id) {
        const url = '/news/' + id;
        return axiosClient.get(url);
    },
    getListNews(data) {
        const url = '/news';
        return axiosClient.get(url);
    },
    deleteNews(id) {
        const url = "/news/" + id;
        return axiosClient.delete(url);
    },
    searchNews(name) {
        const params = {
            query: name.target.value
        }
        const url = '/news/search';
        return axiosClient.get(url, { params });
    },

    
}

export default newsApi;