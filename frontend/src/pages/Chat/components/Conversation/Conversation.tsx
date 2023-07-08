import classnames from "classnames";
import Initials from "../../../../components/Initials/Initials";
import { ConversationDto } from "../../../../types/room";
import styles from "./styles.module.scss";

export type Props = {
  conversation?: ConversationDto;
};

const Conversation = ({
  conversation = {
    name: "bob the builder",
    messages: [
      { messageText: "hi", messageSentAt: new Date(), sentFromMe: true },
      { messageText: "hi", messageSentAt: new Date(), sentFromMe: false },
      { messageText: "hi", messageSentAt: new Date(), sentFromMe: true },
      { messageText: "hi", messageSentAt: new Date(), sentFromMe: false },
      { messageText: "hi", messageSentAt: new Date(), sentFromMe: true },
      { messageText: "hi", messageSentAt: new Date(), sentFromMe: false },
      { messageText: "hi", messageSentAt: new Date(), sentFromMe: true },
      { messageText: "hi", messageSentAt: new Date(), sentFromMe: false },
      { messageText: "hi", messageSentAt: new Date(), sentFromMe: true },
      { messageText: "hi", messageSentAt: new Date(), sentFromMe: false },
      { messageText: "hi", messageSentAt: new Date(), sentFromMe: true },
      { messageText: "hi", messageSentAt: new Date(), sentFromMe: false },
      { messageText: "hi", messageSentAt: new Date(), sentFromMe: true },
      { messageText: "hi", messageSentAt: new Date(), sentFromMe: false },
      { messageText: "hi", messageSentAt: new Date(), sentFromMe: true },
      { messageText: "hi", messageSentAt: new Date(), sentFromMe: false },
    ],
  },
}: Props) => {
  const latestTimeStamp =
    conversation.messages[conversation.messages.length - 1].messageSentAt;
  // When entering this component, make api call according to room id to actually get conversation data.
  return (
    <div className={styles["conversation-wrapper"]}>
      <div className={styles["conversation-header"]}>
        <Initials displayName={conversation.name} variant="yellow" />
        <div className={styles["display-name-and-time"]}>
          <span className={styles["display-name"]}>{conversation.name}</span>
          <span className={styles["last-timestamp"]}>
            {latestTimeStamp.toLocaleTimeString()}
          </span>
        </div>
      </div>
      <div className={styles["conversation-window"]}>
        {conversation.messages.map((message) => (
          <div
            className={classnames({
              [styles["conversation-bubble"]]: true,
              [styles["self"]]: message.sentFromMe,
            })}
          >
            <Initials
              displayName={conversation.name}
              variant={message.sentFromMe ? "blue" : "yellow"}
            />
            <span
              className={classnames({
                [styles["conversation-text"]]: true,
                [styles["self"]]: message.sentFromMe,
                [styles["conversationalist"]]: !message.sentFromMe,
              })}
            >
              {message.messageText}
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
