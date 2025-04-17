"use client";

import { BibleStudyNoteType } from "@prisma/client";
import { ChevronDown, ChevronUp, Quote } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "../../../../hooks/use-debounce";
import {
  type BibleStudyNoteVerseGroupType,
  type TypedBibleStudyNoteQuote,
} from "../../../../server/utils/bible-note-utils";
import { Button } from "../../../ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../../ui/collapsible";
import { Label } from "../../../ui/label";
import { getNoteId } from "../../bible-study-utils";
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
import BibleStudyNoteEditor from "../shared/bible-study-note-editor";
import BibleStudyNoteSavingIndicator from "../shared/bible-study-note-saving-indicator";

type Props = {
  note: TypedBibleStudyNoteQuote;
};

export default function BibleStudyNoteQuote({ note }: Props) {
  const [commentary, setCommentary] = useState(note.data.commentary);
  const [isOpen, setIsOpen] = useState(true);
  const debouncedCommentary = useDebounce(commentary, 500);
  const didSetInitialValue = useRef(false);

  const { updateNote, isLoading } = useBibleStudyUpdateNote();
  const { attributes, listeners, style, setNodeRef } =
    useBibleStudySortableCard(note.id);

  async function handleUpdateVerses(
    verses: BibleStudyNoteVerseGroupType[],
  ): Promise<void> {
    await updateNote({
      id: note.id,
      type: BibleStudyNoteType.QUOTE,
      data: { ...note.data, verses },
    });
  }

  useEffect(() => {
    if (
      !didSetInitialValue.current &&
      commentary === "" &&
      note.data.commentary
    ) {
      setCommentary(note.data.commentary);
      didSetInitialValue.current = true;
    }
  }, [commentary, note]);

  // debounce the update note mutation
  useEffect(() => {
    async function handleUpdateNote() {
      if (
        debouncedCommentary === "" ||
        debouncedCommentary === note.data.commentary
      ) {
        return;
      }

      await updateNote({
        id: note.id,
        type: BibleStudyNoteType.QUOTE,
        data: { ...note.data, commentary: debouncedCommentary },
      });
    }
    void handleUpdateNote();
  }, [debouncedCommentary, note, updateNote]);

  return (
    <div ref={setNodeRef} id={getNoteId(note.id)} style={style}>
      <NoteCard>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="flex flex-col gap-2.5">
            <NoteCardHeader {...attributes} {...listeners}>
              <Quote size={16} className="text-green-500" />
              <Label className="grow">Quote</Label>

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
            <NoteCardContent className="mt-2.5">
              <BibleStudyNoteEditor
                value={commentary}
                onChange={(value) => setCommentary(value)}
              />
              {isLoading && <BibleStudyNoteSavingIndicator />}
            </NoteCardContent>
          </CollapsibleContent>
        </Collapsible>
      </NoteCard>
    </div>
  );
}
