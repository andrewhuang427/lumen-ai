"use client";

import { useRouter } from "next/navigation";
import { type PropsWithChildren, useEffect } from "react";
import useAuth from "../auth/use-auth";
import LoadingScreen from "../loading-screen";

export default function ProtectedRoute({ children }: PropsWithChildren) {
  const { user, dbUser, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user == null && !isLoading) {
      router.push("/");
    }
  }, [user, dbUser, isLoading, router]);

  if (user == null || dbUser == null || isLoading) {
    return <LoadingScreen />;
  }

  return children;
}
