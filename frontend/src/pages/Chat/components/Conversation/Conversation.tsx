import classnames from "classnames";
import Initials from "../../../../components/Initials/Initials";
import { ChatRoomDto, MessageDto } from "../../../../types/room";
import styles from "./styles.module.scss";
import { useState, useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";

import axios from "axios";
import { AccountDto } from "../../../../types/account";

export type Props = {
  room?: ChatRoomDto;
};

const Conversation = ({ room }: Props) => {
  const roomId = room?.ID;
  const [messages, setMessages] = useState<MessageDto[]>([]);
  const [accountDetails] = useLocalStorage<AccountDto | null>("account", null);

  useEffect(() => {
    async function fetchConversation() {
      if (!roomId) return;
      const response = await axios.get(`http://localhost:8080/messages`, {
        params: { chat_room_id: roomId },
      });
      console.log(response.data);
      setMessages(response.data);
    }
    fetchConversation();
  }, [roomId]);

  if (!room) {
    return <div>Please pick a chat to start a conversation.</div>;
  }

  const isCurrentUserParticipantOne =
    accountDetails?.id === room.Participant1ID;
  const latestTimeStamp =
    messages.length === 0
      ? new Date()
      : new Date(messages[messages.length - 1].CreatedAt);
  const recipient =
    room[isCurrentUserParticipantOne ? "Participant2" : "Participant1"]
      .Nickname;
  // When entering this component, make api call according to room id to actually get conversation data.
  return (
    <div className={styles["conversation-wrapper"]}>
      <div className={styles["conversation-header"]}>
        <Initials displayName={recipient} variant="yellow" />
        <div className={styles["display-name-and-time"]}>
          <span className={styles["display-name"]}>{recipient}</span>
          <span className={styles["last-timestamp"]}>
            {latestTimeStamp?.toLocaleTimeString()}
          </span>
        </div>
      </div>
      <div className={styles["conversation-window"]}>
        {messages.map((message) => (
          <div
            className={classnames({
              [styles["conversation-bubble"]]: true,
              [styles["self"]]: accountDetails?.id === message.MessageFromID,
            })}
          >
            <Initials
              displayName={accountDetails?.displayName ?? "??"}
              variant={
                accountDetails?.id === message.MessageFromID ? "blue" : "yellow"
              }
            />
            <span
              className={classnames({
                [styles["conversation-text"]]: true,
                [styles["self"]]: accountDetails?.id === message.MessageFromID,
                [styles["conversationalist"]]:
                  accountDetails?.id !== message.MessageFromID,
              })}
            >
              {message.Content}
            </span>
          </div>
        ))}
      </div>
      <div className={styles["chat-input"]}>
        <input type="text" placeholder="Type your message here..." />
        <button type="button">Send</button>
      </div>
    </div>
  );
};

export default Conversation;
