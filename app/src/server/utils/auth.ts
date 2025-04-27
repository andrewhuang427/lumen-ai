import { type Session } from "@supabase/supabase-js";
import { cookies as getCookies } from "next/headers";
import { cache } from "react";
import { serverSupabase } from "../supabase/supabase-server-client";

export const getAuthenticatedSession = cache(
  async (): Promise<Session | null> => {
    const cookies = await getCookies();
    const mappedCookies = new Map(cookies);
    const accessToken = mappedCookies.get("access-token")?.value;
    const refreshToken = mappedCookies.get("refresh-token")?.value;

    if (!accessToken || !refreshToken) {
      return null;
    }

    try {
      const serverClient = await serverSupabase();
      const { data } = await serverClient.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      return data.session;
    } catch {
      return null;
    }
  },
);
