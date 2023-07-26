import { useEffect, useState } from "react";
import Conversation from "./components/Conversation/Conversation";
import Room from "./components/Room/Room";
import styles from "./styles.module.scss";
import axios from "axios";
import { AccountDto } from "../../types/account";
import { ChatRoomDto } from "../../types/room";
import { API_URL } from "../../utils/config";

type Props = {
  accountDetails: AccountDto | null;
};

const Chat = ({ accountDetails }: Props) => {
  const [rooms, setRooms] = useState<ChatRoomDto[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoomDto>();

  useEffect(() => {
    async function fetchConversation() {
      if (accountDetails) {
        const response = await axios.get(`http://${API_URL}/chat-rooms`, {
          params: { user_id: accountDetails.id },
        });
        setRooms(response.data);
      }
    }
    fetchConversation();
  }, []);

  const onRoomClick = (room: ChatRoomDto) => {
    setSelectedRoom(room);
  };

  return (
    <div className={styles["chat-wrapper"]}>
      <div className={styles["rooms-wrapper"]}>
        {rooms.map((room) => {
          return (
            <Room
              key={room.ID}
              onRoomClick={() => onRoomClick(room)}
              roomData={room}
            />
          );
        })}
      </div>
      <div className={styles["conversation-wrapper"]}>
        <Conversation room={selectedRoom} />
      </div>
    </div>
  );
};

export default Chat;
