"use client";

import { FollowStatus } from "@prisma/client";
import { Check, Loader2 } from "lucide-react";
import useAuth from "../auth/use-auth";
import { Button } from "../ui/button";
import useFollowUser from "./hooks/use-follow-user";
import useUnfollowUser from "./hooks/use-unfollow-user";
import useProfileContext from "./use-profile-context";

export default function ProfileContentFollowButton() {
  const { userProfile, followStatus } = useProfileContext();
  const { user } = useAuth();

  if (userProfile?.id === user?.id) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      {followStatus === null ? <FollowButton /> : <UnfollowButton />}
    </div>
  );
}

function FollowButton() {
  const { userProfile } = useProfileContext();
  const { follow, isPending } = useFollowUser();

  async function handleFollow() {
    if (userProfile == null) {
      return;
    }
    await follow(userProfile.id);
  }

  return (
    <Button size="lg" disabled={isPending} onClick={handleFollow}>
      {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
      Follow
    </Button>
  );
}

function UnfollowButton() {
  const { userProfile, followStatus } = useProfileContext();
  const { unfollow, isPending } = useUnfollowUser();

  async function handleUnfollow() {
    if (userProfile == null) {
      return;
    }
    await unfollow(userProfile.id);
  }

  if (followStatus === FollowStatus.PENDING) {
    return (
      <Button
        size="lg"
        variant="outline"
        disabled={isPending}
        onClick={handleUnfollow}
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Check className="h-4 w-4" />
        )}
        Requested
      </Button>
    );
  }

  return (
    <Button size="lg" variant="outline" onClick={handleUnfollow}>
      {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
      Unfollow
    </Button>
  );
}
