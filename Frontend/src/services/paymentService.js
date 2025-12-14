import api from './api';

export const paymentService = {
  processPayment: async (paymentData) => {
    return await api.post('/payments', paymentData);
  },

  getUserPayments: async (userId) => {
    return await api.get(`/payments/by_user/${userId}`);
  }
};