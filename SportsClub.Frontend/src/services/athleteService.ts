import api from './api';
import type { Athlete, CreateAthleteDto } from '../types/athlete';

export const athleteService = {
    getAllAthletes: async (): Promise<Athlete[]> => {
        const response = await api.get('/athletes');
        return response.data;
    },

    getAthleteById: async (id: string): Promise<Athlete> => {
        const response = await api.get(`/athletes/${id}`);
        return response.data;
    },

    createAthlete: async (data: CreateAthleteDto): Promise<Athlete> => {
        const response = await api.post('/athletes', data);
        return response.data;
    },

    toggleStatus: async (id: string): Promise<void> => {
        await api.patch(`/athletes/${id}/toggle-status`);
    }
};
