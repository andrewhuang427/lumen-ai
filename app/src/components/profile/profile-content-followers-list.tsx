import { type User } from "@prisma/client";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type Props = {
  users: User[];
  isLoading: boolean;
};

export default function ProfileContentFollowersList({
  users,
  isLoading,
}: Props) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2">
        <Loader2 className="size-4 animate-spin" />
        <div className="text-sm text-muted-foreground">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="flex max-h-96 flex-col gap-2 overflow-y-auto">
      {users.map((user) => (
        <UserItem key={user.id} user={user} />
      ))}
    </div>
  );
}

type UserItemProps = {
  user: User;
};

function UserItem({ user }: UserItemProps) {
  return (
    <Link key={user.id} href={`/${user.username}`}>
      <div className="flex cursor-pointer items-center gap-2 rounded-lg p-4 hover:bg-muted/50">
        <Avatar>
          <AvatarImage src={user.avatar_url ?? undefined} />
          <AvatarFallback>{user.name?.[0]}</AvatarFallback>
        </Avatar>
        <div className="ml-2 flex flex-col">
          <div className="font-medium">{user.name}</div>
          <div className="text-sm text-muted-foreground">@{user.username}</div>
        </div>
      </div>
    </Link>
  );
}
