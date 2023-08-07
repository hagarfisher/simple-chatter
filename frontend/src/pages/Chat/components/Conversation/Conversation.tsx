import classnames from "classnames";
import Initials from "../../../../components/Initials/Initials";
import { ChatRoomDto, MessageDto } from "../../../../types/room";
import styles from "./styles.module.scss";
import React, { useState, useEffect, useRef, useContext } from "react";

import axios from "axios";
import { AccountDto } from "../../../../types/account";
import { API_URL } from "../../../../utils/config";
import { getRecipientNickname } from "../../../../utils/utils";
import { UserContext } from "../../../../contexts/UserContext";

export type Props = {
  room?: ChatRoomDto;
};

const Conversation = ({ room }: Props) => {
  let ws = useRef<WebSocket>();
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const roomId = room?.ID;
  const [messages, setMessages] = useState<MessageDto[]>([]);
  const accountDetails = useContext(UserContext);
  const [messageContent, setMessageContent] = useState<string>("");

  useEffect(() => {
    async function fetchConversation() {
      if (!roomId) return;
      const response = await axios.get(`http://${API_URL}/messages`, {
        params: { chat_room_id: roomId },
      });
      setMessages(response.data);
    }
    fetchConversation();
  }, [roomId]);

  useEffect(() => {
    ws.current = new WebSocket(`ws://${API_URL}/messages/subscribe`);

    ws.current.onopen = (event) => {
      console.log(event);
      if (!ws.current) return;
      if (event.type === "open") {
        console.log("connected");
      }
    };

    ws.current.onmessage = async (event) => {
      const payload: MessageDto = JSON.parse(event.data);
      try {
        setMessages((previousMessages) => [...previousMessages, payload]);
      } catch (err) {
        console.error(err);
      }
    };

    return () => {
      ws.current?.close();
    };
  }, [roomId]);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    ws.current?.send(
      JSON.stringify({
        event: "send",
        data: {
          chat_room_id: roomId,
          message_from_id: accountDetails?.id,
          content: messageContent,
        },
      })
    );
    setMessageContent("");
  };

  if (!room || !accountDetails) {
    return <div>Please pick a chat to start a conversation.</div>;
  }

  const latestTimeStamp =
    messages.length === 0
      ? new Date()
      : new Date(messages[messages.length - 1].CreatedAt);
  const recipient = getRecipientNickname(accountDetails, room);
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
      <div className={styles["conversation-window"]} ref={chatWindowRef}>
        {messages.map((message) => (
          <div
            key={message.ID}
            className={classnames({
              [styles["conversation-bubble"]]: true,
              [styles["self"]]: accountDetails?.id === message.MessageFromID,
            })}
          >
            <Initials
              displayName={
                accountDetails?.id === message.MessageFromID
                  ? accountDetails.nickname
                  : recipient
              }
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
      <div
        className={styles["chat-input"]}
        onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => {
          if (event.key === "Enter") {
            handleSendMessage();
          }
        }}
      >
        <input
          value={messageContent}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setMessageContent(event.target.value);
          }}
          type="text"
          placeholder="Type your message here..."
        />
        <button
          type="button"
          onClick={() => {
            handleSendMessage();
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Conversation;
