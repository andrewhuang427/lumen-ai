import { type Session } from "@supabase/supabase-js";
import { cache } from "react";
import { serverSupabase } from "../supabase/supabase-server-client";

export const getAuthenticatedSession = cache(
  async (): Promise<Session | null> => {
    try {
      const serverClient = await serverSupabase();
      const { data } = await serverClient.auth.getSession();
      return data.session ?? null;
    } catch {
      return null;
    }
  },
);
