"use client";

import { BibleStudyNoteType } from "@prisma/client";
import {
  HelpCircle,
  Lightbulb,
  Loader2,
  MessageSquare,
  Quote,
  SquarePlus,
} from "lucide-react";
import { Button } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import useBibleStudyContext from "../context/use-bible-study-context";
import { useBibleStudyCreateNote } from "../hooks/use-bible-study-create-note";
import { useMemo } from "react";

export default function BibleStudyNoteCreateButton() {
  const { session, notes } = useBibleStudyContext();
  const { createNote, isLoading } = useBibleStudyCreateNote();

  const hasQuestionsNote = useMemo(() => {
    return notes.some((note) => note.type === BibleStudyNoteType.QUESTIONS);
  }, [notes]);

  async function handleCreateNote(type: BibleStudyNoteType) {
    if (session == null) {
      return;
    }

    switch (type) {
      case BibleStudyNoteType.UNDERSTANDING:
        await createNote({
          sessionId: session.id,
          type: BibleStudyNoteType.UNDERSTANDING,
          data: { verses: [], messages: [] },
        });
        break;
      case BibleStudyNoteType.QUOTE:
        await createNote({
          sessionId: session.id,
          type: BibleStudyNoteType.QUOTE,
          data: { verses: [], commentary: "" },
        });
        break;
      case BibleStudyNoteType.FREE_FORM:
        await createNote({
          sessionId: session.id,
          type: BibleStudyNoteType.FREE_FORM,
          data: { commentary: "" },
        });
        break;
      case BibleStudyNoteType.QUESTIONS:
        await createNote({
          sessionId: session.id,
          type: BibleStudyNoteType.QUESTIONS,
          data: { questions: [] },
        });
        break;
      default:
        break;
    }
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default" color="primary" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <SquarePlus size={16} />
              Create note
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => handleCreateNote(BibleStudyNoteType.QUOTE)}
          className="flex cursor-pointer flex-col items-start gap-0.5 p-4"
        >
          <div className="flex items-center gap-2">
            <Quote size={16} className="text-green-500" />
            <span>Quote</span>
          </div>
          <div className="text-xs text-muted-foreground">
            Add a quote from the passage
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleCreateNote(BibleStudyNoteType.FREE_FORM)}
          className="flex cursor-pointer flex-col items-start gap-0.5 p-4"
        >
          <div className="flex items-center gap-2">
            <MessageSquare size={16} className="text-blue-500" />
            <span>Free form</span>
          </div>
          <div className="text-xs text-muted-foreground">
            Add a free form note
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleCreateNote(BibleStudyNoteType.UNDERSTANDING)}
          className="flex cursor-pointer flex-col items-start gap-0.5 p-4"
        >
          <div className="flex items-center gap-2">
            <Lightbulb size={16} className="text-yellow-500" />
            <span>Understand</span>
          </div>
          <div className="text-xs text-muted-foreground">
            Chat with Lumen to understand parts of the passage
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={hasQuestionsNote}
          onClick={() => handleCreateNote(BibleStudyNoteType.QUESTIONS)}
          className="flex cursor-pointer flex-col items-start gap-0.5 p-4"
        >
          <div className="flex items-center gap-2">
            <HelpCircle size={16} className="text-purple-500" />
            <span>Questions</span>
          </div>
          <div className="text-xs text-muted-foreground">
            {hasQuestionsNote
              ? "You can only have one questions note per session"
              : "Generate study questions for the passage"}
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
