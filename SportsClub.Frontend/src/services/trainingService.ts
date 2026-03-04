import api from './api';
import type { TrainingSession, CreateTrainingSessionDto } from '../types/training';

export const trainingService = {
    getAllSessions: async (): Promise<TrainingSession[]> => {
        const response = await api.get('/trainingsessions');
        return response.data;
    },

    getSessionsByTeam: async (teamId: string): Promise<TrainingSession[]> => {
        const response = await api.get(`/trainingsessions/team/${teamId}`);
        return response.data;
    },

    createSession: async (data: CreateTrainingSessionDto): Promise<TrainingSession> => {
        const response = await api.post('/trainingsessions', data);
        return response.data;
    },

    deleteSession: async (id: string): Promise<void> => {
        await api.delete(`/trainingsessions/${id}`);
    }
};
