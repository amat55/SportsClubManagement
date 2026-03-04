import api from './api';
import type { Payment, CreatePaymentDto } from '../types/payment';

export const paymentService = {
    getAllPayments: async (): Promise<Payment[]> => {
        const response = await api.get('/payments');
        return response.data;
    },

    getUnpaidPayments: async (): Promise<Payment[]> => {
        const response = await api.get('/payments/unpaid');
        return response.data;
    },

    createPayment: async (data: CreatePaymentDto): Promise<Payment> => {
        const response = await api.post('/payments', data);
        return response.data;
    },

    markAsPaid: async (id: string): Promise<void> => {
        await api.patch(`/payments/${id}/mark-paid`);
    }
};
