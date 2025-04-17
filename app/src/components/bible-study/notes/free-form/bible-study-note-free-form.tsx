"use client";

import { BibleStudyNoteType } from "@prisma/client";
import { MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebounce } from "../../../../hooks/use-debounce";
import { type TypedBibleStudyNoteFreeForm } from "../../../../server/utils/bible-note-utils";
import { Label } from "../../../ui/label";
import { getNoteId } from "../../bible-study-utils";
import { useBibleStudySortableCard } from "../../hooks/use-bible-study-sortable-card";
import { useBibleStudyUpdateNote } from "../../hooks/use-bible-study-update-note";
import {
  NoteCard,
  NoteCardContent,
  NoteCardHeader,
} from "../shared/bible-study-note";
import BibleStudyNoteDeleteButton from "../shared/bible-study-note-delete-button";
import BibleStudyNoteEditor from "../shared/bible-study-note-editor";
import BibleStudyNoteSavingIndicator from "../shared/bible-study-note-saving-indicator";

type Props = {
  note: TypedBibleStudyNoteFreeForm;
};

export default function BibleStudyNoteFreeForm({ note }: Props) {
  const [commentary, setCommentary] = useState(note.data.commentary);
  const debouncedCommentary = useDebounce(commentary, 500);

  const { updateNote, isLoading } = useBibleStudyUpdateNote();
  const { attributes, listeners, style, setNodeRef } =
    useBibleStudySortableCard(note.id);

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
        type: BibleStudyNoteType.FREE_FORM,
        data: { ...note.data, commentary: debouncedCommentary },
      });
    }
    void handleUpdateNote();
  }, [debouncedCommentary, note, updateNote]);

  return (
    <div ref={setNodeRef} id={getNoteId(note.id)} style={style}>
      <NoteCard>
        <NoteCardHeader {...attributes} {...listeners}>
          <MessageSquare size={16} className="text-blue-500" />
          <Label className="grow">Free form</Label>
          <BibleStudyNoteDeleteButton noteId={note.id} />
        </NoteCardHeader>
        <NoteCardContent>
          <BibleStudyNoteEditor
            value={commentary}
            onChange={(value) => setCommentary(value)}
          />
          {isLoading && <BibleStudyNoteSavingIndicator />}
        </NoteCardContent>
      </NoteCard>
    </div>
  );
}
