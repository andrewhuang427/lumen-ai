import { api } from "../../../trpc/react";
import useAuth from "../../auth/use-auth";

export default function useFollowUser() {
  const { dbUser } = useAuth();

  const { mutateAsync: followUserMutation, isPending } =
    api.user.followUser.useMutation();
  const utils = api.useUtils();

  async function follow(userId: string) {
    if (dbUser?.id === userId) {
      return;
    }
    const request = await followUserMutation(userId);
    utils.user.getFollowStatus.setData(userId, request.status);
  }

  return { follow, isPending };
}
