import axios from 'axios';
import queryString from 'query-string';

const axiosClient = axios.create({
    baseURL: 'http://192.168.1.17:3100/api', // Will be updated based on user input
    headers: {
        'content-type': 'application/json'
    },
    paramsSerializer: params => queryString.stringify(params),
});

axiosClient.interceptors.request.use(async (config) => {
    // TODO: Replace localStorage with AsyncStorage for React Native
    // const token = localStorage.getItem('token'); 
    const token = null; // Placeholder
    if(token){
        config.headers.Authorization = `${token}`;
    }
    return config;
});

axiosClient.interceptors.response.use((response) => {
    if (response && response.data) {
        return response.data;
    }
    return response;
}, (error) => {
    console.log("Axios Error:", error.response ? error.response.data : error.message);
    return Promise.reject(error.response ? error.response.data : error);
});

export default axiosClient; 