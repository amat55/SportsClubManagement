import api from './api';
import type { Message, SendMessageDto } from '../types/messaging';

export const messagingService = {
    getInbox: async (): Promise<Message[]> => {
        const response = await api.get('/messages/inbox');
        return response.data;
    },

    getSentMails: async (): Promise<Message[]> => {
        const response = await api.get('/messages/sent');
        return response.data;
    },

    sendMessage: async (data: SendMessageDto): Promise<Message> => {
        const response = await api.post('/messages', data);
        return response.data;
    },

    markAsRead: async (id: string): Promise<string> => {
        const response = await api.patch(`/messages/${id}/read`);
        return response.data;
    }
};
