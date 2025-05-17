import axiosClient from './axiosClient';

const categoryApi = {

    createCategory(data) {
        const url = '/categories';
        return axiosClient.post(url, data);
    },
    getDetailCategory(id) {
        const url = '/categories/' + id;
        return axiosClient.get(url);
    },
    getListCategory() {
        const url = '/categories';
        return axiosClient.get(url);
    },
    deleteCategory(id) {
        const url = "/categories/" + id;
        return axiosClient.delete(url);
    },
    searchCategory(name) {
        const params = {
            name: name.target.value
        }
        const url = '/categories/searchByName';
        return axiosClient.get(url, { params });
    },
    updateCategory(id, data) {
        const url = '/categories/' + id;
        return axiosClient.put(url, data);
    },
}

export default categoryApi;