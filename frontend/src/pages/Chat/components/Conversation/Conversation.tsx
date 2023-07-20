import classnames from "classnames";
import Initials from "../../../../components/Initials/Initials";
import { ConversationDto, MessageDto } from "../../../../types/room";
import styles from "./styles.module.scss";
import { useState, useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";

import axios from "axios";
import { AccountDto } from "../../../../types/account";

export type Props = {
  roomId: string;
};

const Conversation = ({ roomId }: Props) => {
  const [messages, setMessages] = useState<MessageDto[]>([]);
  const [accountDetails, setAccountDetails] =
    useLocalStorage<AccountDto | null>("account", null);

  useEffect(() => {
    async function fetchConversation() {
      const response = await axios.get(`http://localhost:8080/messages`, {
        params: { chat_room_id: roomId },
      });
      console.log(response.data);
      setMessages(response.data);
    }
    fetchConversation();
  }, [roomId]);

  const latestTimeStamp =
    messages.length === 0
      ? null
      : new Date(messages[messages.length - 1].CreatedAt);
  const recipient = messages.length === 0 ? "" : messages[0].MessageFrom;
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
              [styles["self"]]:
                accountDetails?.nickname === message.MessageFrom,
            })}
          >
            <Initials
              displayName={recipient}
              variant={
                accountDetails?.nickname === message.MessageFrom
                  ? "blue"
                  : "yellow"
              }
            />
            <span
              className={classnames({
                [styles["conversation-text"]]: true,
                [styles["self"]]:
                  accountDetails?.nickname === message.MessageFrom,
                [styles["conversationalist"]]:
                  accountDetails?.nickname !== message.MessageFrom,
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
