import { api } from "../../../trpc/react";
import useAuth from "../../auth/use-auth";

export default function useUnfollowUser() {
  const { dbUser } = useAuth();

  const { mutateAsync: unfollowUserMutation, isPending } =
    api.user.unfollowUser.useMutation();
  const utils = api.useUtils();

  async function unfollow(userId: string) {
    if (dbUser?.id === userId) {
      return;
    }
    await unfollowUserMutation(userId);
    utils.user.getFollowStatus.setData(userId, null);
  }

  return { unfollow, isPending };
}
