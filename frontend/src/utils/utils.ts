import { AccountDto } from "../types/account";
import { ChatRoomDto } from "../types/room";

const isCurrentUserParticipantOne = (
  accountDetails: AccountDto,
  room: ChatRoomDto
) => accountDetails?.id === room.Participant1ID;

export const getRecipientNickname = (
  accountDetails: AccountDto,
  room: ChatRoomDto
) => {
  return room[
    isCurrentUserParticipantOne(accountDetails, room)
      ? "Participant2"
      : "Participant1"
  ].Nickname;
};
