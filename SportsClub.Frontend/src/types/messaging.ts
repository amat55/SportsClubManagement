export interface Message {
    id: string;
    senderId: string;
    senderName: string;
    receiverId: string;
    receiverName: string;
    content: string;
    sentAt: string;
    isRead: boolean;
    readAt: string | null;
}

export interface SendMessageDto {
    receiverId: string;
    content: string;
}
