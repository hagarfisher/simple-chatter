export type ChatRoomDto = {
  ID: number;
  Participant1ID: number;
  Participant1: { Nickname: string };
  Participant2ID: number;
  Participant2: { Nickname: string };
  LastMessage: string;
  UpdatedAt: Date;
};

export type MessageDto = {
  ID: number;
  ChatRoomID: number;
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
