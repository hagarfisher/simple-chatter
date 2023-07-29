import { AccountDto } from "../types/account";
import { ChatRoomDto } from "../types/room";

export const isCurrentUserParticipantOne = (
  accountDetails: AccountDto,
  room: ChatRoomDto
) => accountDetails?.id === room.Participant1ID;
