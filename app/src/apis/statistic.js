import axiosClient from './axiosClient';

const statisticApi = {
    /*Danh sách api sự kiện */
    getTotal() {
        const url = '/statistical/count';
        return axiosClient.get(url);
    },
}

export default statisticApi;