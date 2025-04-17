import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import { type TypedBibleStudyNote } from "../../../server/utils/bible-note-utils";
import { api } from "../../../trpc/react";
import useBibleStudyContext from "../context/use-bible-study-context";
import BibleStudyNotesPanelCard from "./bible-study-notes-panel-card";

export default function BibleStudyNotesPanelList() {
  const [notes, setNotes] = useState<TypedBibleStudyNote[]>([]);
  const { session, notes: fetchedNotes } = useBibleStudyContext();

  const { mutateAsync: reorder } = api.bibleStudy.reorderNotes.useMutation();
  const utils = api.useUtils();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    }),
  );

  async function handleReorderNotes(notes: TypedBibleStudyNote[]) {
    if (session == null) {
      return;
    }
    // 1. optimistically update the notes in the cache
    utils.bibleStudy.getNotes.setData(
      { sessionId: session.id },
      (prevNotes) => {
        if (prevNotes == null) {
          return [];
        } else {
          return notes;
        }
      },
    );

    // 2. reorder the notes on the server
    await reorder({
      sessionId: session.id,
      noteIds: notes.map((note) => note.id),
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over == null) {
      return;
    }

    if (active.id !== over.id) {
      setNotes((notes) => {
        const oldIndex = notes.findIndex((note) => note.id === active.id);
        const newIndex = notes.findIndex((note) => note.id === over.id);

        const newNotes = arrayMove(notes, oldIndex, newIndex);
        void handleReorderNotes(newNotes);
        return newNotes;
      });
    }
  }

  useEffect(() => {
    setNotes(fetchedNotes);
  }, [fetchedNotes]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
    >
      <SortableContext items={notes} strategy={verticalListSortingStrategy}>
        {notes.map((note) => (
          <BibleStudyNotesPanelCard key={note.id} note={note} />
        ))}
      </SortableContext>
    </DndContext>
  );
}
