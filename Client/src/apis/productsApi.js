import axiosClient from './axiosClient';

const productApi = {
    // Lấy danh sách sản phẩm
    getAllProducts: () => {
        const url = '/products';
        return axiosClient.get(url);
    },

    // Lấy chi tiết sản phẩm theo ID
    getProductById: (id) => {
        const url = `/products/${id}`;
        return axiosClient.get(url);
    },

    // Tạo mới sản phẩm
    createProduct: (data) => {
        const url = '/products';
        return axiosClient.post(url, data);
    },

    // Cập nhật sản phẩm
    updateProduct: (id, data) => {
        const url = `/products/${id}`;
        return axiosClient.put(url, data);
    },

    // Xóa sản phẩm
    deleteProduct: (id) => {
        const url = `/products/${id}`;
        return axiosClient.delete(url);
    },

    // Tìm kiếm sản phẩm
    searchProducts: (query) => {
        const url = '/products/search';
        return axiosClient.get(url, { params: { query } });
    }
};

export default productApi;
