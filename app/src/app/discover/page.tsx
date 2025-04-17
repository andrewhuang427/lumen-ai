import DiscoverHeader from "../../components/discover/discover-header";
import DiscoverFeed from "../../components/discover/feed/discover-feed";
import { api, HydrateClient } from "../../trpc/server";

export default async function DiscoverPage() {
  await api.discover.getFeed.prefetchInfinite({ limit: 5 });

  return (
    <HydrateClient>
      <DiscoverHeader />
      <DiscoverFeed />
    </HydrateClient>
  );
}
