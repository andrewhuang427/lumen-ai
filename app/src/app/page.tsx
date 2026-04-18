import { api, HydrateClient } from "~/trpc/server";
import BibleReader from "../components/bible-reader/bible-reader";

export default async function HomeWrapper() {
  await Promise.all([
    api.bible.getVersions.prefetch(),
    // Prefetch reading location so it's hydrated and the provider can
    // immediately seed the last-read chapter (or Genesis 1) with no network delay.
    api.user.getReadingLocation.prefetch(),
  ]);

  return (
    <HydrateClient>
      <BibleReader />
    </HydrateClient>
  );
}
