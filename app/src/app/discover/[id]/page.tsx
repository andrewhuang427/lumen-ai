import DiscoverReader from "../../../components/discover/reader/discover-reader";
import { api, HydrateClient } from "../../../trpc/server";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function DiscoverPage({ params }: Props) {
  const id = (await params).id;
  await api.discover.getPost.prefetch(id);

  return (
    <HydrateClient>
      <DiscoverReader postId={id} />
    </HydrateClient>
  );
}
