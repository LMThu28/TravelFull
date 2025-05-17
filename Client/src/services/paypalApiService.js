import axiosClient from '../apis/axiosClient';

const paypalApiService = {
    makePayment: async (paymentData) => {
        try {
            const response = await axiosClient.post('/payment/pay', paymentData);
            return response;
        } catch (error) {
            console.error('Error making payment:', error);
            throw error;
        }
    },

    executePayment: async (paymentId, PayerID, token) => {
        try {
            const response = await axiosClient.get(`/payment/executePayment`, { params: { paymentId, PayerID, token } });
            return response;
        } catch (error) {
            console.error('Error executing payment:', error);
            throw error;
        }
    }
};

export default paypalApiService;