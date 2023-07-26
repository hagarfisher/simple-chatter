import Initials from "../../../../components/Initials/Initials";
import { ChatRoomDto } from "../../../../types/room";
import styles from "./styles.module.scss";

type Props = {
  roomData: ChatRoomDto;
  onRoomClick: () => void;
};

const Room = ({ roomData, onRoomClick }: Props) => {
  const timeToDisplay = new Date(roomData.UpdatedAt).toLocaleTimeString();
  const maxTextLength = 32;
  const messageContentParsed =
    roomData.LastMessage.length > maxTextLength
      ? `${roomData.LastMessage.slice(0, maxTextLength)}...`
      : roomData.LastMessage;
  return (
    <button onClick={onRoomClick} className={styles["room-wrapper"]}>
      <Initials displayName={roomData.Participant2.Nickname} variant="blue" />
      <div className={styles["message-content"]}>
        <span className={styles["sender-name"]}>
          {roomData.Participant2.Nickname}
        </span>
        <span className={styles["last-message-content"]}>
          {messageContentParsed}
        </span>
      </div>
      <span className={styles["time-to-display"]}>{timeToDisplay}</span>
    </button>
  );
};

export default Room;
