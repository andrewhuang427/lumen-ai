import { api, apiCaller, HydrateClient } from "~/trpc/server";
import BibleReader from "../components/bible-reader/bible-reader";

export default async function HomeWrapper() {
  // Get the actual reading location value so we can prefetch the full dependency chain
  const readingLocation = await apiCaller.user.getReadingLocation();

  await Promise.all([
    api.bible.getVersions.prefetch(),
    api.user.getReadingLocation.prefetch(),
    readingLocation.version?.id
      ? api.bible.getBooks.prefetch({ versionId: readingLocation.version.id })
      : Promise.resolve(),
    readingLocation.book?.id
      ? api.bible.getChapters.prefetch({ bookId: readingLocation.book.id })
      : Promise.resolve(),
    readingLocation.chapter?.id
      ? api.bible.getChapter.prefetch({ chapterId: readingLocation.chapter.id })
      : Promise.resolve(),
  ]);

  return (
    <HydrateClient>
      <BibleReader />
    </HydrateClient>
  );
}
