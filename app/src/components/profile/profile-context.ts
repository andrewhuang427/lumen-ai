import { type FollowStatus } from "@prisma/client";
import { createContext } from "react";
import { type UserProfile } from "../../server/services/user-service";

export type ProfileContextType = {
  username: string;
  userProfile: UserProfile | null;
  followStatus: FollowStatus | null;
  canSeeProfile: boolean;
  isFollowing: boolean;
  isUserLoading: boolean;
};

export const ProfileContext = createContext<ProfileContextType>({
  username: "",
  userProfile: null,
  followStatus: null,
  canSeeProfile: false,
  isFollowing: false,
  isUserLoading: false,
});
