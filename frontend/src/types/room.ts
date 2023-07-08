export type RoomDto = {
    id: number;
    name: string;
    lastMessageText: string;
    lastUpdated: Date;
}

export type ConversationDto = {
    name: string;
    messages: {
        messageText: string;
        messageSentAt: Date;
        sentFromMe: boolean;
    }[];
}