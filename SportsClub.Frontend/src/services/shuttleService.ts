import api from './api';
import type { Shuttle, EnrollStudentDto, CreateShuttleDto } from '../types/shuttle';

export const shuttleService = {
    getAllShuttles: async (): Promise<Shuttle[]> => {
        const response = await api.get('/shuttles');
        return response.data;
    },

    createShuttle: async (data: CreateShuttleDto): Promise<Shuttle> => {
        const response = await api.post('/shuttles', data);
        return response.data;
    },

    enrollStudent: async (shuttleId: string, data: EnrollStudentDto): Promise<string> => {
        const response = await api.post(`/shuttles/${shuttleId}/enroll`, data);
        return response.data;
    },

    removeStudent: async (shuttleId: string, athleteId: string): Promise<string> => {
        const response = await api.delete(`/shuttles/${shuttleId}/remove/${athleteId}`);
        return response.data;
    }
};
