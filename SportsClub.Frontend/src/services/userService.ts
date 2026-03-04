import api from './api';
import type { User } from '../types/user';

export const userService = {
    getCoaches: async (): Promise<User[]> => {
        const response = await api.get('/users/coaches');
        return response.data;
    },

    getAllUsers: async (): Promise<User[]> => {
        const response = await api.get('/users');
        return response.data;
    }
};
