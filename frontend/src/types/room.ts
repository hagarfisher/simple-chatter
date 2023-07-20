export type ChatRoomDto = {
  Id: number;
  Participant1: string;
  Participant2: string;
  LastMessage: string;
  LastUpdated: Date;
};

export type MessageDto = {
  Id: number;
  ChatRoomId: number;
  MessageFrom: string;
  MessageTo: string;
  Content: string;
  CreatedAt: Date;
};
export type ConversationDto = {
  name: string;
  messages: {
    messageText: string;
    messageSentAt: Date;
    sentFromMe: boolean;
  }[];
};
