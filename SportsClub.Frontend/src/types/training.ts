export interface TrainingSession {
    id: string;
    title: string;
    description: string;
    teamId: string;
    teamName: string;
    coachId: string | null;
    coachName: string;
    startTime: string;
    endTime: string;
    location: string;
}

export interface CreateTrainingSessionDto {
    title: string;
    description: string;
    teamId: string;
    coachId?: string;
    startTime: string;
    endTime: string;
    location: string;
}
