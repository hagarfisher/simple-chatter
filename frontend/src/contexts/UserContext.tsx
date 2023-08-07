import { createContext } from "react";
import { AccountDto } from "../types/account";
export const UserContext = createContext<AccountDto | null>(null);
