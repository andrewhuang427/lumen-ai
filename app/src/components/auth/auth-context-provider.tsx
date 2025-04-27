"use client";

import { type User } from "@prisma/client";
import { type Session } from "@supabase/supabase-js";
import posthog from "posthog-js";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { browserSupabase } from "../../server/supabase/supabase-client";
import { api } from "../../trpc/react";
import { AuthContext } from "./auth-context";
import { setSessionCookies } from "./auth-utils";

type Props = {
  defaultSession: Session | null;
  defaultUser: User | null;
  children: ReactNode;
};

export default function AuthContextProvider({
  defaultSession,
  defaultUser,
  children,
}: Props) {
  const [session, setSession] = useState<Session | null>(defaultSession);
  const [user, setUser] = useState<User | null>(defaultUser);

  const {
    mutateAsync: getOrCreateAuthenticatedUser,
    isPending: isFetchingAuthenticatedUser,
  } = api.user.getOrCreateAuthenticatedUser.useMutation();

  const fetchedAuthUserId = useRef<string | null>(null);

  useEffect(() => {
    async function handleAuthStateChange(session: Session | null) {
      setSession(session);
      setSessionCookies(session);

      if (session == null) {
        setUser(null);
        posthog.reset();
        return;
      }

      if (fetchedAuthUserId.current !== session.user.id) {
        fetchedAuthUserId.current = session.user.id;
        const updatedUser = await getOrCreateAuthenticatedUser();
        setUser(updatedUser);
        if (updatedUser != null) {
          posthog.identify(updatedUser.id);
        }
      }
    }

    function handleSignedOut() {
      fetchedAuthUserId.current = null;
      setUser(null);
      setSession(null);
      posthog.reset();
    }

    const listener = browserSupabase().auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN") {
          void handleAuthStateChange(session);
        }
        if (event === "SIGNED_OUT") {
          void handleSignedOut();
        }
      },
    );

    return () => {
      listener.data.subscription.unsubscribe();
    };
  }, [getOrCreateAuthenticatedUser]);

  const value = useMemo(
    () => ({
      user,
      session,
      isLoading: isFetchingAuthenticatedUser,
    }),
    [session, user, isFetchingAuthenticatedUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
