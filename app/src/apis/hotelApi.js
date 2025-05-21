import axiosClient from './axiosClient';

const hotelApi = {
    getAllHotels: (params) => {
        const url = '/hotels';
        return axiosClient.get(url, { params })
            .then(response => {
                console.log('getAllHotels response:', response);
                return response;
            })
            .catch(error => {
                console.error('getAllHotels error:', error);
                throw error;
            });
    },

    getHotelById: (id) => {
        console.log('API call for hotel ID:', id);
        const url = `/hotels/${id}`;
        return axiosClient.get(url)
            .then(response => {
                console.log('getHotelById response:', response);
                return response;
            })
            .catch(error => {
                console.error('getHotelById error:', error);
                throw error;
            });
    },

    getHotelsByCategory: (categoryId, params) => {
        const url = `/hotels/category/${categoryId}`;
        return axiosClient.get(url, { params });
    },

    searchHotels: (params) => {
        const url = '/hotels/search';
        return axiosClient.get(url, { params });
    },

    // For development/testing, return mock data
    getMockHotels: () => {
        return Promise.resolve({
            data: {
                hotels: [
                    {
                        id: 1,
                        name: 'Vinpearl Resort & Spa',
                        location: 'Nha Trang, Khánh Hòa',
                        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1080&q=80',
                        price: 2500000,
                        rating: 4.8,
                        reviewCount: 520
                    },
                    {
                        id: 2,
                        name: 'Mường Thanh Luxury',
                        location: 'Đà Nẵng',
                        image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1080&q=80',
                        price: 1800000,
                        rating: 4.5,
                        reviewCount: 350
                    },
                    {
                        id: 3,
                        name: 'InterContinental Saigon',
                        location: 'Hồ Chí Minh',
                        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1080&q=80',
                        price: 3200000,
                        rating: 4.9,
                        reviewCount: 780
                    }
                ]
            }
        });
    }
};

export default hotelApi; 