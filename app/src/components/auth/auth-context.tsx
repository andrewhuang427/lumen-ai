import { type User } from "@prisma/client";
import { type Session } from "@supabase/supabase-js";
import { createContext, type Dispatch, type SetStateAction } from "react";

export type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  setUser: Dispatch<SetStateAction<User | null>>;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: false,
  setUser: () => {},
});
