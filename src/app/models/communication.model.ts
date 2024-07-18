export interface Interest {
    id: number;
    userId: number;
    interestedUserId: number;
    status: 'sent' | 'received' | 'accepted' | 'declined';
}

export interface Message {
    id: number;
    senderId: number;
    receiverId: number;
    content: string;
    timestamp: string;
}
