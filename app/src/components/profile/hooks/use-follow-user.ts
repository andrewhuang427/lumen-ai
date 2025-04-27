import { api } from "../../../trpc/react";
import useAuth from "../../auth/use-auth";

export default function useFollowUser() {
  const { user } = useAuth();

  const { mutateAsync: followUserMutation, isPending } =
    api.user.followUser.useMutation();
  const utils = api.useUtils();

  async function follow(userProfileId: string) {
    if (user?.id === userProfileId) {
      return;
    }
    const request = await followUserMutation(userProfileId);
    utils.user.getFollowStatus.setData(userProfileId, request.status);
  }

  return { follow, isPending };
}
