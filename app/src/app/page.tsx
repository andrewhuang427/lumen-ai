import { api, HydrateClient } from "~/trpc/server";
import BibleReader from "../components/bible-reader/bible-reader";

export default async function HomeWrapper() {
  await api.bible.getVersions.prefetch();

  return (
    <HydrateClient>
      <BibleReader />
    </HydrateClient>
  );
}
