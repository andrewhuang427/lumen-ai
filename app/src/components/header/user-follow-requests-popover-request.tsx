import { type FollowRequestWithUser } from "../../server/services/user-service";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import UserFollowRequestsPopoverRequestActions from "./user-follow-requests-popover-request-actions";

type Props = {
  request: FollowRequestWithUser;
};

export default function UserFollowRequestRow({ request }: Props) {
  return (
    <div key={request.id} className="flex items-center gap-2 p-4">
      <Avatar className="size-8">
        <AvatarImage src={request.from_user.avatar_url ?? undefined} />
        <AvatarFallback>{request.from_user.name?.[0]}</AvatarFallback>
      </Avatar>
      <div className="flex grow flex-col">
        <p className="text-sm font-medium">{request.from_user.name}</p>
        <p className="text-sm text-muted-foreground">
          {request.from_user.username}
        </p>
      </div>
      <UserFollowRequestsPopoverRequestActions request={request} />
    </div>
  );
}
