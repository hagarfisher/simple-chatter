import Initials from "../../../../components/Initials/Initials";
import { RoomDto } from "../../../../types/room";
import styles from "./styles.module.scss";

type Props = {
  roomData: RoomDto;
};

const Room = ({ roomData }: Props) => {
  const timeToDisplay = roomData.lastUpdated.toLocaleTimeString();
  const maxTextLength = 32;
  const messageContentParsed = roomData.lastMessageText.length > maxTextLength ? `${roomData.lastMessageText.slice(0, maxTextLength)}...` : roomData.lastMessageText;
  return (
    <button className={styles["room-wrapper"]}>
      <Initials displayName={roomData.name} variant="blue"/>
      <div className={styles["message-content"]}>
        <span className={styles["sender-name"]}>{roomData.name}</span>
        <span className={styles["last-message-content"]}>{messageContentParsed}</span>
      </div>
      <span className={styles["time-to-display"]}>{timeToDisplay}</span>
    </button>
  );
};

export default Room;
