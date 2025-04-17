import { type User as DbUser } from "@prisma/client";
import { type Session, type User as SupabaseUser } from "@supabase/supabase-js";
import { createContext } from "react";

export type AuthContextType = {
  user: SupabaseUser | null;
  dbUser: DbUser | null;
  session: Session | null;
  isLoading: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  dbUser: null,
  session: null,
  isLoading: false,
});
