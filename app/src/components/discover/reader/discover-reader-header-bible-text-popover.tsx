import { BookOpen, Loader2 } from "lucide-react";
import { Fragment, useMemo } from "react";
import { type EnrichedBibleStudyPost } from "../../../server/services/discover-feed-service";
import { api } from "../../../trpc/react";
import BibleChapter from "../../bible/bible-chapter";
import { Button } from "../../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { getPostChapterRange } from "./discover-reader-utils";

type Props = {
  post: EnrichedBibleStudyPost;
};

export default function DiscoverReaderHeaderBibleTextPopover({ post }: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button>
          <BookOpen />
          Show {getPostChapterRange(post)}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="mt-2 h-[calc(100vh-12rem)] w-[500px] overflow-y-auto"
      >
        <BibleTextPopoverContent post={post} />
      </PopoverContent>
    </Popover>
  );
}

function BibleTextPopoverContent({ post }: Props) {
  const { data: session, isLoading } =
    api.bibleStudy.getSessionChapters.useQuery({
      sessionId: post.session_id,
    });

  const book = useMemo(() => {
    return session?.book ?? null;
  }, [session?.book]);

  const chapters = useMemo(() => {
    return session?.chapters ?? [];
  }, [session?.chapters]);

  return (
    <div className="flex flex-col gap-4 p-4">
      {isLoading || book == null ? (
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <div className="text-sm text-muted-foreground">
            Loading Bible text...
          </div>
        </div>
      ) : (
        chapters.map((chapter) => {
          return (
            <Fragment key={chapter.id}>
              <BibleChapter
                book={book}
                chapter={chapter}
                isSelectTextEnabled={false}
                selectedVerses={[]}
                setSelectedVerses={() => {}}
              />
            </Fragment>
          );
        })
      )}
    </div>
  );
}
