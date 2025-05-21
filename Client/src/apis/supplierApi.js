import axiosClient from './axiosClient';

const supplierApi = {
    createSupplier(data) {
        const url = '/supplier';
        return axiosClient.post(url, data);
    },
    getDetailSupplier(id) {
        const url = '/supplier/' + id;
        return axiosClient.get(url);
    },
    getListSuppliers(data) {
        const url = '/supplier';
        return axiosClient.get(url);
    },
    deleteSupplier(id) {
        const url = '/supplier/' + id;
        return axiosClient.delete(url);
    },
    searchSuppliers(name) {
        const params = {
            name: name.target.value
        };
        const url = '/supplier/search';
        return axiosClient.get(url, { params });
    },
};

export default supplierApi;
