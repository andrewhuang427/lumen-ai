"use client";

import { Bell } from "lucide-react";
import { api } from "../../trpc/react";
import useAuth from "../auth/use-auth";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Separator } from "../ui/separator";
import UserFollowRequestRow from "./user-follow-requests-popover-request";

export default function UserFollowRequestsPopover() {
  const { user } = useAuth();

  const { data: pendingFollowRequests } =
    api.user.getPendingFollowRequests.useQuery(undefined, {
      enabled: user != null,
    });

  const hasPendingFollowRequests =
    pendingFollowRequests != null && pendingFollowRequests.length > 0;

  if (user == null) {
    return null;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          aria-label="Follow requests"
          variant="outline"
          size="icon"
          className="relative"
        >
          <Bell size={16} />
          {hasPendingFollowRequests && (
            <div className="absolute -right-1 -top-1 size-2 rounded-full bg-red-500"></div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="flex w-[450px] flex-col p-0">
        <p className="p-4 text-sm font-medium">Pending follow requests</p>
        <Separator />
        {hasPendingFollowRequests ? (
          pendingFollowRequests?.map((request) => (
            <UserFollowRequestRow key={request.id} request={request} />
          ))
        ) : (
          <p className="p-4 text-center text-sm text-muted-foreground">
            No pending follow requests
          </p>
        )}
      </PopoverContent>
    </Popover>
  );
}
