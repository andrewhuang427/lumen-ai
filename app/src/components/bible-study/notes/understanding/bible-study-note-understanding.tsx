"use client";

import { BibleStudyNoteType } from "@prisma/client";
import { ChevronDown, ChevronUp, CircleAlert, Lightbulb } from "lucide-react";
import { useEffect, useState } from "react";
import {
  type BibleStudyNoteVerseGroupType,
  type TypedBibleStudyNoteUnderstand,
} from "../../../../server/utils/bible-note-utils";
import { Button } from "../../../ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../../ui/collapsible";
import { Label } from "../../../ui/label";
import { getNoteId } from "../../bible-study-utils";
import useBibleStudyGetNote from "../../hooks/use-bible-study-get-note";
import { useBibleStudySendUnderstandingMessage } from "../../hooks/use-bible-study-send-understanding-message";
import { useBibleStudySortableCard } from "../../hooks/use-bible-study-sortable-card";
import { useBibleStudyUpdateNote } from "../../hooks/use-bible-study-update-note";
import {
  NoteCard,
  NoteCardContent,
  NoteCardHeader,
  NoteVerse,
} from "../shared/bible-study-note";
import BibleStudyNoteDeleteButton from "../shared/bible-study-note-delete-button";
import BibleStudyNoteEditVersesButton from "../shared/bible-study-note-edit-verses-button";
import BibleStudyNoteUnderstandingHoverCard from "./bible-study-note-understanding-hover-card";
import BibleStudyNoteUnderstandingMessages from "./bible-study-note-understanding-messages";
import BibleStudyNoteUnderstandingTextarea from "./bible-study-note-understanding-textarea";

type Props = {
  note: TypedBibleStudyNoteUnderstand;
};

export default function BibleStudyNoteUnderstanding({ note }: Props) {
  const [isSending, setIsSending] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState<
    TypedBibleStudyNoteUnderstand["data"]["messages"]
  >(note.data.messages);

  const { attributes, listeners, setNodeRef, style } =
    useBibleStudySortableCard(note.id);

  const { updateNote, isLoading } = useBibleStudyUpdateNote();
  const { sendMessage } = useBibleStudySendUnderstandingMessage();
  const { getNote: refetchNote } = useBibleStudyGetNote();

  async function handleUpdateVerses(
    verses: BibleStudyNoteVerseGroupType[],
  ): Promise<void> {
    await updateNote({
      id: note.id,
      type: BibleStudyNoteType.UNDERSTANDING,
      data: { ...note.data, verses },
    });
  }

  async function handleSendMessage(message: string) {
    try {
      setIsSending(true);
      // 1. add user message and create a new assistant message
      setMessages((prev) => [
        ...prev,
        { role: "user", content: message },
        { role: "assistant", content: "" },
      ]);

      // 2. execute mutation and update message based on streaming response
      let newMessage = "";
      await sendMessage(note.id, message, (chunk) => {
        newMessage += chunk;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last == null) {
            return prev;
          }
          return [...prev.slice(0, -1), { ...last, content: newMessage }];
        });
      });

      // 3. refetch note and update cached note
      await refetchNote(note.id);
    } finally {
      setIsSending(false);
    }
  }

  // update messages state when note changes
  useEffect(() => {
    setMessages(note.data.messages);
  }, [note]);

  return (
    <div ref={setNodeRef} id={getNoteId(note.id)} style={style}>
      <NoteCard>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="flex flex-col gap-4">
            <NoteCardHeader {...attributes} {...listeners}>
              <Lightbulb size={16} className="text-yellow-500" />
              <Label>Understand</Label>
              <BibleStudyNoteUnderstandingHoverCard />
              <div className="grow" />
              <BibleStudyNoteEditVersesButton
                initialVerses={note.data.verses}
                isUpdating={isLoading}
                onUpdate={handleUpdateVerses}
              />
              <BibleStudyNoteDeleteButton noteId={note.id} />
              <CollapsibleTrigger asChild>
                <Button variant="secondary" size="icon" className="h-8 w-8">
                  {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </Button>
              </CollapsibleTrigger>
            </NoteCardHeader>
            <NoteVerse verses={note.data.verses} />
          </div>
          <CollapsibleContent>
            <NoteCardContent className="mt-4 flex flex-col gap-4">
              {messages.length > 0 && (
                <BibleStudyNoteUnderstandingMessages messages={messages} />
              )}
              <BibleStudyNoteUnderstandingTextarea
                note={note}
                isSending={isSending}
                onSendMessage={handleSendMessage}
              />
              <div className="flex items-center justify-center gap-2 text-center">
                <p className="text-xs text-muted-foreground">
                  <CircleAlert
                    size={12}
                    className="mb-0.5 mr-1.5 inline-block shrink-0"
                  />
                  Always compare responses with scripture and consult trusted
                  sources for deeper understanding.
                </p>
              </div>
            </NoteCardContent>
          </CollapsibleContent>
        </Collapsible>
      </NoteCard>
    </div>
  );
}
