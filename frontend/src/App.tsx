import { useLocalStorage } from "usehooks-ts";
import Chat from "./pages/Chat/Chat";
import Identification from "./pages/Identification/Identification";
import { AccountDto } from "./types/account";
import { useState } from "react";
import { UserContext } from "./contexts/UserContext";

const App = () => {
  // Extract nickname and data from local storage, if user is logged in show chat window, if not show chat window grayed out with native dialog on top with request to connect.
  const [accountDetails, setAccountDetails] =
    useLocalStorage<AccountDto | null>("account", null);
  const [isModalOpen, setIsModalOpen] = useState(!accountDetails);

  const onConnect = (newAccountData: AccountDto) => {
    if (newAccountData) {
      setAccountDetails(newAccountData);
      setIsModalOpen(false);
    }
  };
  return (
    <UserContext.Provider value={accountDetails}>
      <div className="main-wrapper">
        {accountDetails && <Chat accountDetails={accountDetails} />}
        <Identification onConnect={onConnect} isOpen={isModalOpen} />
      </div>
    </UserContext.Provider>
  );
};

export default App;
