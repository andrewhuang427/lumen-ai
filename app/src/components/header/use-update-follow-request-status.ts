import { type FollowRequestWithUser } from "../../server/services/user-service";
import { api } from "../../trpc/react";
import useAuth from "../auth/use-auth";

export default function useUpdateFollowRequestStatus() {
  const { user } = useAuth();

  const { mutateAsync: updateFollowRequestStatusMutation, isPending } =
    api.user.updateFollowRequestStatus.useMutation();
  const utils = api.useUtils();

  async function updateRequest(
    request: FollowRequestWithUser,
    action: "accept" | "reject",
  ) {
    if (user == null) {
      return;
    }

    await updateFollowRequestStatusMutation({ requestId: request.id, action });
    // filter request from follow requests query
    utils.user.getPendingFollowRequests.setData(undefined, (prevData) => {
      if (prevData == null) return prevData;
      return prevData.filter((r) => r.id !== request.id);
    });

    // invalidate queries for user followers and following
    await Promise.all([
      utils.user.getUserFollowersCount.invalidate(request.from_user.id),
      utils.user.getUserFollowingCount.invalidate(request.from_user.id),
      utils.user.getUserFollowers.invalidate(request.from_user.id),
      utils.user.getUserFollowing.invalidate(request.from_user.id),
      utils.user.getUserFollowersCount.invalidate(user.id),
      utils.user.getUserFollowingCount.invalidate(user.id),
      utils.user.getUserFollowers.invalidate(user.id),
      utils.user.getUserFollowing.invalidate(user.id),
    ]);
  }

  return { updateRequest, isPending };
}
