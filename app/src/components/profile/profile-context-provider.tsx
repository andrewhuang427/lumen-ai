"use client";

import { FollowStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import { type PropsWithChildren, useEffect, useMemo } from "react";
import { api } from "../../trpc/react";
import useAuth from "../auth/use-auth";
import LoadingScreen from "../loading-screen";
import { ProfileContext, type ProfileContextType } from "./profile-context";

type Props = PropsWithChildren<{
  username: string;
}>;

export default function ProfileContextProvider({ children, username }: Props) {
  const { dbUser } = useAuth();

  const { data: user = null, isLoading: isUserLoading } =
    api.user.getUserByUsername.useQuery(username);

  const { data: followStatus = null, isLoading: isFollowStatusLoading } =
    api.user.getFollowStatus.useQuery(user?.id ?? "", {
      enabled: user != null,
    });

  const router = useRouter();

  useEffect(() => {
    if (user == null && !isUserLoading) {
      router.push("/");
    }
  }, [user, router, isUserLoading]);

  const contextValue: ProfileContextType = useMemo(() => {
    const isMe = dbUser?.id === user?.id;

    return {
      username,
      user,
      followStatus,
      canSeeProfile: isMe || followStatus === FollowStatus.ACCEPTED,
      isFollowing: followStatus === FollowStatus.ACCEPTED,
      isUserLoading: isUserLoading || isFollowStatusLoading,
    };
  }, [
    username,
    user,
    dbUser,
    followStatus,
    isUserLoading,
    isFollowStatusLoading,
  ]);

  if (contextValue.isUserLoading) {
    return <LoadingScreen label="Loading profile..." />;
  }

  return (
    <ProfileContext.Provider value={contextValue}>
      {children}
    </ProfileContext.Provider>
  );
}
