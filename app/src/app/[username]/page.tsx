import ProfileContent from "../../components/profile/profile-content";
import ProfileContextProvider from "../../components/profile/profile-context-provider";
import ProfileHeader from "../../components/profile/profile-header";
import { api, HydrateClient } from "../../trpc/server";

type Props = {
  params: Promise<{ username: string }>;
};

export default async function UsernamePage({ params }: Props) {
  const username = decodeURIComponent((await params).username);
  const userNameWithoutAt = username.replace("@", "");
  await api.user.getUserByUsername.prefetch(userNameWithoutAt);

  return (
    <HydrateClient>
      <ProfileContextProvider username={userNameWithoutAt}>
        <ProfileHeader />
        <ProfileContent />
      </ProfileContextProvider>
    </HydrateClient>
  );
}
