import { type User as DbUser } from "@prisma/client";
import { type Session, type User as SupabaseUser } from "@supabase/supabase-js";
import { cookies as getCookies } from "next/headers";
import { cache } from "react";
import { api } from "../../trpc/server";
import { serverSupabase } from "../supabase/supabase-server-client";

export const getServerUser = cache(
  async (): Promise<{
    user: SupabaseUser | null;
    session: Session | null;
    dbUser: DbUser | null;
  }> => {
    const cookies = await getCookies();
    const mappedCookies = new Map(cookies);
    const accessToken = mappedCookies.get("access-token")?.value;
    const refreshToken = mappedCookies.get("refresh-token")?.value;

    if (!accessToken || !refreshToken) {
      return {
        user: null,
        session: null,
        dbUser: null,
      };
    }

    try {
      const serverClient = await serverSupabase();
      const { error, data } = await serverClient.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (error || data.user == null || data.session == null) {
        return {
          user: null,
          session: null,
          dbUser: null,
        };
      }

      const dbUser = await api.user.me();
      return { ...data, dbUser };
    } catch {
      return {
        user: null,
        session: null,
        dbUser: null,
      };
    }
  },
);
