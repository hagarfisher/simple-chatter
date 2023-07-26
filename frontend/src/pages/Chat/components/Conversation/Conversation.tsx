import classnames from "classnames";
import Initials from "../../../../components/Initials/Initials";
import { ChatRoomDto, MessageDto } from "../../../../types/room";
import styles from "./styles.module.scss";
import { useState, useEffect, useRef } from "react";
import { useLocalStorage } from "usehooks-ts";

import axios from "axios";
import { AccountDto } from "../../../../types/account";
import { API_URL } from "../../../../utils/config";

export type Props = {
  room?: ChatRoomDto;
};

const Conversation = ({ room }: Props) => {
  let ws = useRef<WebSocket>();
  const roomId = room?.ID;
  const [messages, setMessages] = useState<MessageDto[]>([]);
  const [accountDetails] = useLocalStorage<AccountDto | null>("account", null);
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
        ws.current.send(
          JSON.stringify({
            event: "subscribe",
            data: {
              chat_room_id: roomId,
            },
          })
        );
      }
    };

    ws.current.onmessage = (event) => {
      const payload: {
        event: string;
        data: {
          chat_room_id: number;
          message_from_id: number;
          content: string;
        };
      } = JSON.parse(event.data);
      try {
        if (payload.event === "data" || payload.event === "send") {
          const reformattedMessage: MessageDto = {
            ChatRoomID: payload.data.chat_room_id,
            Content: payload.data.content,
            MessageFromID: payload.data.message_from_id,
            ID: 0,
            CreatedAt: new Date(),
          };
          setMessages((previousMessages) => [
            ...previousMessages,
            reformattedMessage,
          ]);
        }
      } catch (err) {
        console.error(err);
      }
    };

    return () => {
      ws.current?.close();
    };
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
            key={message.ID}
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
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Conversation;
