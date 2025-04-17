"use client";

import { BibleStudyNoteType } from "@prisma/client";
import { type TypedBibleStudyNote } from "../../../server/utils/bible-note-utils";
import BibleStudyNoteFreeForm from "./free-form/bible-study-note-free-form";
import BibleStudyNoteQuestions from "./questions/bible-study-note-questions";
import BibleStudyNoteQuote from "./quote/bible-study-note-quote";
import BibleStudyNoteUnderstanding from "./understanding/bible-study-note-understanding";

type Props = {
  note: TypedBibleStudyNote;
};

export default function BibleStudyNotesPanelCard({ note }: Props) {
  switch (note.type) {
    case BibleStudyNoteType.QUOTE:
      return <BibleStudyNoteQuote note={note} />;
    case BibleStudyNoteType.UNDERSTANDING:
      return <BibleStudyNoteUnderstanding note={note} />;
    case BibleStudyNoteType.FREE_FORM:
      return <BibleStudyNoteFreeForm note={note} />;
    case BibleStudyNoteType.QUESTIONS:
      return <BibleStudyNoteQuestions note={note} />;
    default:
      return null;
  }
}
