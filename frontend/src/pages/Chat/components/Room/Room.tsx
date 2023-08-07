import { UserContext } from "../../../../contexts/UserContext";
import { useContext } from "react";
import Initials from "../../../../components/Initials/Initials";
import { ChatRoomDto } from "../../../../types/room";
import { getRecipientNickname } from "../../../../utils/utils";
import styles from "./styles.module.scss";
import { AccountDto } from "../../../../types/account";

type Props = {
  roomData: ChatRoomDto;
  onRoomClick: () => void;
};

const Room = ({ roomData, onRoomClick }: Props) => {
  const accountDetails = useContext(UserContext);
  const timeToDisplay = new Date(roomData.UpdatedAt).toLocaleTimeString();
  const maxTextLength = 32;
  const messageContentParsed =
    roomData.LastMessage.length > maxTextLength
      ? `${roomData.LastMessage.slice(0, maxTextLength)}...`
      : roomData.LastMessage;
  if (!accountDetails) return null;
  const recipient = getRecipientNickname(accountDetails, roomData);

  return (
    <button onClick={onRoomClick} className={styles["room-wrapper"]}>
      <Initials displayName={recipient} variant="blue" />
      <div className={styles["message-content"]}>
        <span className={styles["sender-name"]}>{recipient}</span>
        <span className={styles["last-message-content"]}>
          {messageContentParsed}
        </span>
      </div>
      <span className={styles["time-to-display"]}>{timeToDisplay}</span>
    </button>
  );
};

export default Room;
