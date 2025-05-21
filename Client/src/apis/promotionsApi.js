import axiosClient from './axiosClient';

const promotionsApi = {
    createPromotion(data) {
        const url = '/promotions';
        return axiosClient.post(url, data);
    },
    getDetailPromotion(id) {
        const url = '/promotions/' + id;
        return axiosClient.get(url);
    },
    getListPromotions() {
        const url = '/promotions';
        return axiosClient.get(url);
    },
    updatePromotion(id, data) {
        const url = '/promotions/' + id;
        return axiosClient.put(url, data);
    },
    deletePromotion(id) {
        const url = '/promotions/' + id;
        return axiosClient.delete(url);
    },
    searchPromotion(name) {
        const params = {
            name: name.target.value
        }
        const url = '/promotions/searchByName';
        return axiosClient.get(url, { params });
    },
}

export default promotionsApi; 