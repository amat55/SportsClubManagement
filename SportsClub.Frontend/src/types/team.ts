export interface Branch {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
}

export interface Team {
    id: string;
    name: string;
    branchId: string;
    branchName: string;
    coachId: string;
    coachName: string;
    season: string;
    isActive: boolean;
    athleteCount?: number;
}

export interface CreateTeamDto {
    name: string;
    branchId: string;
    coachId: string;
    season: string;
}
