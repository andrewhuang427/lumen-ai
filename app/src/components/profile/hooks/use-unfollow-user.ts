import { api } from "../../../trpc/react";
import useAuth from "../../auth/use-auth";

export default function useUnfollowUser() {
  const { user } = useAuth();

  const { mutateAsync: unfollowUserMutation, isPending } =
    api.user.unfollowUser.useMutation();
  const utils = api.useUtils();

  async function unfollow(userProfileId: string) {
    if (user?.id === userProfileId) {
      return;
    }
    await unfollowUserMutation(userProfileId);
    utils.user.getFollowStatus.setData(userProfileId, null);
  }

  return { unfollow, isPending };
}
