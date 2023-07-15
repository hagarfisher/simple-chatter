import { useState } from "react";
import { AccountDto } from "../../types/account";
import styles from "./styles.module.scss";
import axios from "axios";

type Props = {
  onConnect: (account: AccountDto) => void;
  isOpen: boolean;
};

const Identification = ({ onConnect, isOpen }: Props) => {
  const [displayName, setDisplayName] = useState("");

  const handleDisplayNameInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    setDisplayName(value);
  };

  const handleConnectClick = async () => {
    if (displayName) {
      try {
        const { data } = await axios.post<{ success: string }>(
          "http://localhost:8080/auth",
          {
            nickname: displayName,
          }
        );
        console.log("bob", data);
      } catch (error) {
        console.error(error);
      }
      onConnect({
        displayName,
        nickname: displayName.replace(" ", "_").toLowerCase(),
      });
    }
  };

  return (
    <dialog open={isOpen} className={styles["identification-dialog-wrapper"]}>
      <input
        type="text"
        placeholder="Enter your display name..."
        value={displayName}
        onChange={handleDisplayNameInputChange}
      />
      <button type="button" onClick={handleConnectClick}>
        Connect
      </button>
    </dialog>
  );
};

export default Identification;
