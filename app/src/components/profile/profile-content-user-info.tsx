"use client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import ProfileContentFollowButton from "./profile-content-follow-button";
import ProfileContentFollowers from "./profile-content-followers";
import useProfileContext from "./use-profile-context";

export default function ProfileContentUserInfo() {
  const { userProfile } = useProfileContext();

  if (userProfile == null) {
    return null;
  }

  return (
    <div className="flex items-center gap-8">
      <div className="flex grow flex-col gap-8">
        <div className="flex grow items-center gap-8">
          <Avatar className="size-24">
            <AvatarImage src={userProfile.avatar_url ?? undefined} />
            <AvatarFallback className="rounded-lg text-2xl">
              {userProfile.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex grow flex-col gap-1">
            <h1 className="text-xl font-medium tracking-tight">
              {userProfile.name}
            </h1>
            <p className="text-sm text-muted-foreground">
              @{userProfile.username}
            </p>
          </div>
          <ProfileContentFollowButton />
        </div>
        <ProfileContentFollowers userId={userProfile.id} />
      </div>
    </div>
  );
}
