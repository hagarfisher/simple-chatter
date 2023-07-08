import { useState } from "react";
import { AccountDto } from "../../types/account";
import styles from "./styles.module.scss";

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

  const handleConnectClick = () => {
    if (displayName) {
      onConnect({
        displayName,
        nickname: displayName.replace(' ', '_').toLowerCase(),
      });
    }
  }

  return (
    <dialog open={isOpen} className={styles["identification-dialog-wrapper"]}>
      <input
        type="text"
        placeholder="Enter your display name..."
        value={displayName}
        onChange={handleDisplayNameInputChange}
      />
      <button type="button" onClick={handleConnectClick}>Connect</button>
    </dialog>
  );
};

export default Identification;
