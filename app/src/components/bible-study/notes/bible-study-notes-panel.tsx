"use client";

import { Scroll } from "lucide-react";
import Header from "../../header/header";
import { Skeleton } from "../../ui/skeleton";
import useBibleStudyContext from "../context/use-bible-study-context";
import BibleStudyNoteCreateButton from "./bible-study-note-create-button";
import BibleStudyNotesPanelList from "./bible-study-notes-panel-list";
import useBibleStudyNotesPanelScrollableContext from "./context/use-bible-study-notes-panel-scrollable-context";
import BibleStudyNoteGenerateQuestionsButton from "./bible-study-note-generate-questions-button";

export default function BibleStudyNotesPanel() {
  const { session, notes, isLoadingNotes } = useBibleStudyContext();
  const scrollableRef = useBibleStudyNotesPanelScrollableContext();

  const isLoading = session == null || isLoadingNotes;
  const hasNotes = notes.length > 0;
  return (
    <div className="relative flex h-full w-full min-w-0 flex-col">
      <Header
        title="Notes"
        description="Keep track of your thoughts and insights."
        end={
          isLoading ? (
            <Skeleton className="h-8 w-24" />
          ) : hasNotes ? (
            <BibleStudyNoteCreateButton />
          ) : null
        }
        showSidebarTrigger={false}
      />
      <div
        ref={scrollableRef}
        className="flex w-full flex-1 flex-col gap-6 overflow-y-auto p-6"
      >
        {isLoading ? (
          <>
            <Skeleton className="h-36" />
            <Skeleton className="h-36" />
            <Skeleton className="h-36" />
          </>
        ) : hasNotes ? (
          <BibleStudyNotesPanelList />
        ) : (
          <EmptyNotesBanner />
        )}
      </div>
    </div>
  );
}

function EmptyNotesBanner() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <Scroll strokeWidth={1.5} size={32} className="text-muted-foreground" />
        <span className="max-w-xs text-center text-sm text-muted-foreground">
          Notes help you keep track of your thoughts and insights. Add a note to
          get started.
        </span>
        <div className="flex items-center gap-2">
          <BibleStudyNoteCreateButton />
          <BibleStudyNoteGenerateQuestionsButton />
        </div>
      </div>
    </div>
  );
}
