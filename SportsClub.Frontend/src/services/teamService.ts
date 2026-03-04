import api from './api';
import type { Team, CreateTeamDto, Branch } from '../types/team';

export const teamService = {
    getAllTeams: async (): Promise<Team[]> => {
        const response = await api.get('/teams');
        return response.data;
    },

    getAllBranches: async (): Promise<Branch[]> => {
        const response = await api.get('/teams/branches');
        return response.data;
    },

    createTeam: async (data: CreateTeamDto): Promise<Team> => {
        const response = await api.post('/teams', data);
        return response.data;
    },

    assignCoach: async (teamId: string, coachId: string): Promise<string> => {
        const response = await api.post(`/teams/${teamId}/assign-coach/${coachId}`);
        return response.data;
    },

    addAthleteToTeam: async (teamId: string, athleteId: string): Promise<string> => {
        const response = await api.post(`/teams/${teamId}/add-athlete/${athleteId}`);
        return response.data;
    },

    removeAthleteFromTeam: async (teamId: string, athleteId: string): Promise<string> => {
        const response = await api.delete(`/teams/${teamId}/remove-athlete/${athleteId}`);
        return response.data;
    }
};
