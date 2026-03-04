export interface Payment {
    id: string;
    athleteId: string;
    athleteFullName: string;
    paymentType: string;
    amount: number;
    dueDate: string;
    paymentDate: string | null;
    isPaid: boolean;
    description: string;
}

export interface CreatePaymentDto {
    athleteId: string;
    paymentType: string;
    amount: number;
    dueDate: string;
    description: string;
}
