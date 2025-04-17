"use client";

import { type User as DbUser } from "@prisma/client";
import { type Session, type User as SupabaseUser } from "@supabase/supabase-js";
import posthog from "posthog-js";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import { browserSupabase } from "../../server/supabase/supabase-client";
import { api } from "../../trpc/react";
import { AuthContext } from "./auth-context";
import { setSessionCookies } from "./auth-utils";

type Props = {
  user: SupabaseUser | null;
  session: Session | null;
  dbUser: DbUser | null;
  children: ReactNode;
};

export default function AuthContextProvider({
  user: initialUser,
  session: initialSession,
  dbUser: initialDbUser,
  children,
}: Props) {
  const [session, setSession] = useState<Session | null>(initialSession);
  const [user, setUser] = useState<SupabaseUser | null>(initialUser);
  const [dbUser, setDbUser] = useState<DbUser | null>(initialDbUser);
  const [isLoading, setIsLoading] = useState(!initialUser);

  const { refetch: fetchDbUser, isLoading: isFetchingDbUser } =
    api.user.me.useQuery(undefined, {
      enabled: initialDbUser != null,
      initialData: initialDbUser,
    });

  useEffect(() => {
    async function handleAuthStateChange(session: Session | null) {
      setSession(session);
      setUser(session?.user ?? null);
      setSessionCookies(session);

      if (session?.user != null) {
        // when a user is logged in, we need to fetch the db user
        const response = await fetchDbUser();
        setDbUser(response.data ?? null);
        posthog.identify(session.user.id);
      } else {
        // when a user is logged out, we need to clear the db user
        setDbUser(null);
        posthog.reset();
      }

      setIsLoading(false);
    }

    void browserSupabase()
      .auth.getSession()
      .then(({ data: { session } }) => {
        void handleAuthStateChange(session);
      });

    const { data: authListener } = browserSupabase().auth.onAuthStateChange(
      (_event, session) => {
        void handleAuthStateChange(session);
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [fetchDbUser]);

  const value = useMemo(
    () => ({
      session,
      user,
      dbUser,
      isLoading: isLoading || isFetchingDbUser,
    }),
    [session, user, dbUser, isLoading, isFetchingDbUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
