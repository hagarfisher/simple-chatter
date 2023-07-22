import { useEffect, useState } from "react";
import Conversation from "./components/Conversation/Conversation";
import Room from "./components/Room/Room";
import styles from "./styles.module.scss";
import axios from "axios";
import { AccountDto } from "../../types/account";
import { ChatRoomDto } from "../../types/room";

type Props = {
  accountDetails: AccountDto | null;
};

const Chat = ({ accountDetails }: Props) => {
  const [rooms, setRooms] = useState<ChatRoomDto[]>([]);
  const [selectedRoom, setSelectedRoom] = useState("1");

  useEffect(() => {
    async function fetchConversation() {
      if (accountDetails) {
        const response = await axios.get(`http://localhost:8080/chat-rooms`, {
          params: { user_id: accountDetails.id },
        });
        setRooms(response.data);
      }
    }
    fetchConversation();
  }, []);

  const onRoomClick = (roomId: string) => {
    setSelectedRoom(roomId);
  };

  return (
    <div className={styles["chat-wrapper"]}>
      <div className={styles["rooms-wrapper"]}>
        {rooms.map((room) => {
          return (
            <Room
              onRoomClick={() => onRoomClick(room.ID.toString())}
              roomData={room}
            />
          );
        })}
      </div>
      <div className={styles["conversation-wrapper"]}>
        <Conversation roomId={selectedRoom} />
      </div>
    </div>
  );
};

export default Chat;
