import { rooms } from "./chat.helpers";
import Conversation from "./components/Conversation/Conversation";
import Room from "./components/Room/Room";
import styles from "./styles.module.scss";

const Chat = () => {
  
  return (
    <div className={styles["chat-wrapper"]}>
      <div className={styles["rooms-wrapper"]}>
        {rooms.map((room) => {
          return <Room roomData={room} />;
        })}
      </div>
      <div className={styles["conversation-wrapper"]}>
        <Conversation />
      </div>
    </div>
  );
};

export default Chat;
