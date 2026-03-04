export interface Athlete {
    id: string;
    firstName: string;
    lastName: string;
    motherName: string;
    fatherName: string;
    schoolName: string;
    grade: string;
    dateOfBirth: string;
    placeOfBirth: string;
    address: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
    emergencyContactRelation: string;
    phoneNumber: string;
    bloodType: string;
    height: number;
    weight: number;
    isActive: boolean;
    registrationDate: string;
}

export interface CreateAthleteDto {
    firstName: string;
    lastName: string;
    motherName: string;
    fatherName: string;
    schoolName: string;
    grade: string;
    dateOfBirth: string;
    placeOfBirth: string;
    address: string;
    phoneNumber: string;
    bloodType: number;
    regularMedications: string;
    chronicDiseases: string;
    height: number;
    weight: number;
    shoeSize: number;
    emergencyContactName: string;
    emergencyContactPhone: string;
    emergencyContactRelation: string;
}
