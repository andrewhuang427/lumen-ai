"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { cn } from "../../lib/utils";
import { api } from "../../trpc/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import ProfileContentFollowersList from "./profile-content-followers-list";
import useProfileContext from "./use-profile-context";

type Props = {
  userId: string;
};

export default function ProfileContentFollowers({ userId }: Props) {
  return (
    <div className="flex items-center gap-2">
      <ProfileContentFollowersItem userId={userId} />
      <ProfileContentFollowingItem userId={userId} />
    </div>
  );
}

function ProfileContentFollowersItem({ userId }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const { canSeeProfile } = useProfileContext();

  const { data: followersCount = 0, isLoading: isLoadingFollowers } =
    api.user.getUserFollowersCount.useQuery(userId);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <ClickableItem
          name="Followers"
          count={followersCount}
          isLoading={isLoadingFollowers}
          isDisabled={!canSeeProfile}
          onClick={() => setIsOpen(true)}
        />
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Followers</DialogTitle>
        </DialogHeader>
        <FollowersList userId={userId} />
      </DialogContent>
    </Dialog>
  );
}

function ProfileContentFollowingItem({ userId }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const { canSeeProfile } = useProfileContext();

  const { data: followingCount = 0, isLoading: isLoadingFollowing } =
    api.user.getUserFollowingCount.useQuery(userId);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <ClickableItem
          name="Following"
          count={followingCount}
          isLoading={isLoadingFollowing}
          isDisabled={!canSeeProfile}
          onClick={() => setIsOpen(true)}
        />
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Following</DialogTitle>
        </DialogHeader>
        <FollowingList userId={userId} />
      </DialogContent>
    </Dialog>
  );
}

function FollowingList({ userId }: Props) {
  const { data: following = [], isLoading } =
    api.user.getUserFollowing.useQuery(userId);

  return (
    <ProfileContentFollowersList users={following} isLoading={isLoading} />
  );
}

function FollowersList({ userId }: Props) {
  const { data: followers = [], isLoading } =
    api.user.getUserFollowers.useQuery(userId);

  return (
    <ProfileContentFollowersList users={followers} isLoading={isLoading} />
  );
}

type ClickableItemProps = {
  name: string;
  count: number;
  isLoading: boolean;
  isDisabled: boolean;
  onClick: () => void;
};

function ClickableItem({
  name,
  count,
  isLoading,
  isDisabled,
  onClick,
}: ClickableItemProps) {
  return (
    <div
      className={cn(
        "flex cursor-pointer items-center justify-center gap-2 rounded-lg border px-4 py-2 shadow",
        isDisabled ? "cursor-default" : "cursor-pointer hover:bg-muted/50",
      )}
      onClick={isDisabled ? undefined : onClick}
    >
      <div className="flex h-6 items-center justify-center text-lg font-medium">
        {isLoading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <span>{count}</span>
        )}
      </div>
      <div className="text-sm text-muted-foreground">{name}</div>
    </div>
  );
}
