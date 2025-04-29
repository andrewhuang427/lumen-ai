import { BibleStudyNoteType } from "@prisma/client";
import { HelpCircle, Loader2 } from "lucide-react";
import { Button } from "../../ui/button";
import useBibleStudyContext from "../context/use-bible-study-context";
import { useBibleStudyCreateNote } from "../hooks/use-bible-study-create-note";

export default function BibleStudyNoteGenerateQuestionsButton() {
  const { session } = useBibleStudyContext();
  const { createNote, isLoading } = useBibleStudyCreateNote();

  async function handleCreateQuestionsNote() {
    if (session == null) {
      return;
    }

    await createNote({
      sessionId: session.id,
      type: BibleStudyNoteType.QUESTIONS,
      data: { questions: [] },
    });
  }

  return (
    <Button onClick={handleCreateQuestionsNote} disabled={isLoading}>
      {isLoading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <HelpCircle size={16} />
      )}
      Generate questions
    </Button>
  );
}
