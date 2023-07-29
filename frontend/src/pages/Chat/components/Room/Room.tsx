import { useLocalStorage } from "usehooks-ts";
import Initials from "../../../../components/Initials/Initials";
import { ChatRoomDto } from "../../../../types/room";
import { isCurrentUserParticipantOne } from "../../../../utils/utils";
import styles from "./styles.module.scss";
import { AccountDto } from "../../../../types/account";

type Props = {
  roomData: ChatRoomDto;
  onRoomClick: () => void;
};

const Room = ({ roomData, onRoomClick }: Props) => {
  const [accountDetails] = useLocalStorage<AccountDto | null>("account", null);
  const timeToDisplay = new Date(roomData.UpdatedAt).toLocaleTimeString();
  const maxTextLength = 32;
  const messageContentParsed =
    roomData.LastMessage.length > maxTextLength
      ? `${roomData.LastMessage.slice(0, maxTextLength)}...`
      : roomData.LastMessage;
  if (!accountDetails) return null;
  const recipient =
    roomData[
      isCurrentUserParticipantOne(accountDetails, roomData)
        ? "Participant2"
        : "Participant1"
    ].Nickname;
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
