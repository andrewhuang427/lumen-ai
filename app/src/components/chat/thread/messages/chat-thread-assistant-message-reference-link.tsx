"use client";

import { type BibleVerse as BibleVerseType } from "@prisma/client";
import {
  BookOpen,
  CirclePlus,
  CircleX,
  Loader2,
  PlusCircle,
} from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import { Fragment, memo, useEffect, useMemo, useState } from "react";
import { api } from "../../../../trpc/react";
import { useBibleReaderContext } from "../../../bible-reader/use-bible-reader-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../ui/dropdown-menu";
import { parseBibleReferenceDetails } from "../../chat-utils";

type Props = {
  reference: string;
  isStreaming: boolean;
};

export const ChatThreadAssistantMessageReferenceLink = memo(
  ChatThreadAssistantMessageReferenceLinkImpl,
  (prev, next) => {
    return prev.reference === next.reference;
  },
);

function ChatThreadAssistantMessageReferenceLinkImpl({
  reference,
  isStreaming,
}: Props) {
  // If the message is still streaming, don't show the popover
  if (isStreaming) {
    return <span className="text-blue-500">{reference}</span>;
  }
  return (
    <ChatThreadAssistantMessageReferenceLinkPopoverImpl reference={reference} />
  );
}

function ChatThreadAssistantMessageReferenceLinkPopoverImpl({
  reference,
}: {
  reference: string;
}) {
  const [open, setOpen] = useState(false);
  const [shouldFetchVerses, setShouldFetchVerses] = useState(false);
  const { selectedVersion } = useBibleReaderContext();
  const router = useRouter();

  const { mutateAsync: createSession, isPending: isCreatingSession } =
    api.bibleStudy.createSessionFromBookDetails.useMutation();

  const referenceDetails = useMemo(() => {
    return parseBibleReferenceDetails(reference);
  }, [reference]);

  // Use useEffect to control when to fetch verses
  useEffect(() => {
    if (open && selectedVersion != null && referenceDetails != null) {
      setShouldFetchVerses(true);
    } else {
      setShouldFetchVerses(false);
    }
  }, [open, selectedVersion, referenceDetails]);

  const {
    data: verses = [],
    error: versesError,
    isLoading: isLoadingVerses,
  } = api.bible.getVerses.useQuery(
    {
      versionId: selectedVersion?.id ?? "",
      bookName: referenceDetails?.bookName ?? "",
      chapterNumber: referenceDetails?.startChapter ?? 0,
      startVerseNumber: referenceDetails?.startVerse ?? 0,
      endVerseNumber: referenceDetails?.endVerse,
    },
    { enabled: shouldFetchVerses },
  );

  function handleRead(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    const details = parseBibleReferenceDetails(reference);
    if (details == null) {
      return;
    }

    const { bookName, startChapter } = details;
    router.push(`/?book=${bookName}&chapter=${startChapter}`);
    setOpen(false);
  }

  async function handleStartBibleStudy(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (referenceDetails == null) {
      return;
    }
    const { bookName, startChapter } = referenceDetails;
    const session = await createSession({
      bookName,
      startChapterNumber: startChapter,
    });
    router.push(`/study/${session.id}`);
    setOpen(false);
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger>
        <span className="group relative mx-0.5 inline-flex h-7 items-center gap-1.5 rounded-full bg-blue-500/10 px-2 py-0 text-blue-500 transition-all hover:cursor-pointer hover:bg-blue-500/20 hover:text-blue-600">
          <span className="font-medium">{reference}</span>
          <CirclePlus className="size-3.5 opacity-80 transition-transform group-hover:scale-110" />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-96">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Actions
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleRead}>
          <BookOpen className="size-4 text-blue-500" />
          <span className="grow">Read</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleStartBibleStudy}>
          {isCreatingSession ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <PlusCircle className="size-4 text-green-500" />
          )}
          <span className="grow">Start Bible study</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="p-2">
          {versesError != null ? (
            <div className="flex items-center justify-center gap-2 p-4 text-red-500">
              <CircleX className="size-4" />
              <span className="text-xs">Error loading Bible verses</span>
            </div>
          ) : isLoadingVerses ? (
            <div className="flex items-center justify-center gap-2 p-4">
              <Loader2 className="size-4 animate-spin" />
              <span className="text-xs">Loading Bible verses...</span>
            </div>
          ) : (
            <BibleVerses verses={verses} />
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function BibleVerses({ verses }: { verses: BibleVerseType[] }) {
  return (
    <>
      {verses.map((verse) => (
        <Fragment key={verse.id}>
          <span className="mr-0.5 text-xs text-blue-500">
            {verse.verse_number}
          </span>
          <span className="text-xs">{verse.text.replace(/\n/g, " ")}</span>
        </Fragment>
      ))}
    </>
  );
}
