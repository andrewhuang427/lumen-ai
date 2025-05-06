"use client";

import { type DraggableAttributes } from "@dnd-kit/core";
import { type SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { BibleStudyNoteType } from "@prisma/client";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDebounce } from "../../../../hooks/use-debounce";
import { useGenerateBibleQuestions } from "../../../../hooks/use-generate-bible-questions";
import { type TypedBibleStudyNoteQuestions } from "../../../../server/utils/bible-note-utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../ui/alert-dialog";
import { Button } from "../../../ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../../ui/collapsible";
import { Label } from "../../../ui/label";
import { getNoteId } from "../../bible-study-utils";
import useBibleStudyContext from "../../context/use-bible-study-context";
import { useBibleStudySortableCard } from "../../hooks/use-bible-study-sortable-card";
import { useBibleStudyUpdateNote } from "../../hooks/use-bible-study-update-note";
import {
  NoteCard,
  NoteCardContent,
  NoteCardHeader,
} from "../shared/bible-study-note";
import BibleStudyNoteDeleteButton from "../shared/bible-study-note-delete-button";
import BibleStudyNoteSavingIndicator from "../shared/bible-study-note-saving-indicator";
import { type BibleStudyNoteQuestionItemType } from "./bible-study-note-question-item";
import { BibleStudyNoteQuestionList } from "./bible-study-note-question-list";
import { initializeQuestions } from "./bible-study-note-question-utils";

type Props = {
  note: TypedBibleStudyNoteQuestions;
};

export default function BibleStudyNoteQuestions({ note }: Props) {
  const initialQuestions = initializeQuestions(note);

  const [isOpen, setIsOpen] = useState(true);
  const [questions, setQuestions] =
    useState<BibleStudyNoteQuestionItemType[]>(initialQuestions);
  const [isSaving, setIsSaving] = useState(false);
  const debouncedQuestions = useDebounce(questions, 500);
  const prevDebouncedQuestions = useRef(debouncedQuestions);
  const initialGenerationDone = useRef(initialQuestions.length > 0);

  const { attributes, listeners, setNodeRef, style } =
    useBibleStudySortableCard(note.id);

  const { updateNote, isLoading } = useBibleStudyUpdateNote();
  const { generateQuestions, isGenerating } = useGenerateBibleQuestions();
  const { book, chapters } = useBibleStudyContext();

  const handleUpdateNote = useCallback(async () => {
    setIsSaving(true);
    try {
      await updateNote({
        id: note.id,
        type: BibleStudyNoteType.QUESTIONS,
        data: {
          questions,
        },
      });
    } finally {
      setTimeout(() => setIsSaving(false), 500);
    }
  }, [note.id, questions, updateNote]);

  const handleUpdateQuestionResponse = useCallback(
    (index: number, response: string) => {
      setQuestions((prevQuestions) =>
        prevQuestions.map((item, i) =>
          i === index ? { ...item, response } : item,
        ),
      );
    },
    [],
  );

  const handleUpdateGeneratedResponse = useCallback(
    (index: number, generatedResponse: string) => {
      setQuestions((prevQuestions) =>
        prevQuestions.map((item, i) =>
          i === index ? { ...item, generatedResponse } : item,
        ),
      );
    },
    [],
  );

  const handleRemoveQuestion = useCallback((index: number) => {
    setQuestions((prevQuestions) =>
      prevQuestions.filter((_, i) => i !== index),
    );
  }, []);

  const handleGenerateQuestions = useCallback(async () => {
    if (book == null || isGenerating) {
      return;
    }

    const passageText = chapters
      .map((chapter) =>
        chapter.sections
          .map((section) => section.verses.map((verse) => verse.text).join(" "))
          .join(" "),
      )
      .join(" ");

    setQuestions([]);
    await generateQuestions(
      {
        bookName: book.name,
        passageText,
      },
      (question) => {
        const newQuestionItem: BibleStudyNoteQuestionItemType = {
          question: question.question,
          verses: question.verses,
          response: "",
        };
        setQuestions((prevQuestions) => [...prevQuestions, newQuestionItem]);
      },
    );
  }, [isGenerating, book, chapters, generateQuestions]);

  // Save questions when they change (debounced)
  useEffect(() => {
    const currentQuestionsJSON = JSON.stringify(debouncedQuestions);
    const prevQuestionsJSON = JSON.stringify(prevDebouncedQuestions.current);

    if (currentQuestionsJSON !== prevQuestionsJSON) {
      void handleUpdateNote();
      prevDebouncedQuestions.current = debouncedQuestions;
    }
  }, [debouncedQuestions, handleUpdateNote]);

  // Auto-generate questions if there are none and we haven't already generated them
  useEffect(() => {
    if (
      !initialGenerationDone.current &&
      !isGenerating &&
      questions.length === 0
    ) {
      initialGenerationDone.current = true;
      void handleGenerateQuestions();
    }
  }, [questions.length, isGenerating, handleGenerateQuestions]);

  return (
    <div ref={setNodeRef} id={getNoteId(note.id)} style={style}>
      <NoteCard>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="flex flex-col gap-4">
            <QuestionsNoteHeader
              isSaving={isSaving}
              isOpen={isOpen}
              noteId={note.id}
              attributes={attributes}
              listeners={listeners}
              onGenerateQuestions={handleGenerateQuestions}
              isGeneratingQuestions={isGenerating}
              questions={questions}
            />
            <CollapsibleContent>
              <NoteCardContent className="p-0">
                {isGenerating && questions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center"
                    >
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                          rotate: [0, 0, 0],
                        }}
                        transition={{
                          duration: 2,
                          ease: "easeInOut",
                          repeat: Infinity,
                        }}
                      >
                        <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
                      </motion.div>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mt-4 text-center text-sm"
                      >
                        Generating questions about this scripture passage...
                      </motion.p>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="mt-2 text-center text-xs text-muted-foreground"
                      >
                        <span>Questions will gradually appear</span>
                      </motion.div>
                    </motion.div>
                  </div>
                ) : (
                  <BibleStudyNoteQuestionList
                    questions={questions}
                    isLoading={isLoading}
                    onUpdateResponse={handleUpdateQuestionResponse}
                    onRemoveQuestion={handleRemoveQuestion}
                    noteId={note.id}
                    onUpdateGeneratedResponse={handleUpdateGeneratedResponse}
                  />
                )}
              </NoteCardContent>
            </CollapsibleContent>
          </div>
        </Collapsible>
      </NoteCard>
    </div>
  );
}

interface QuestionsNoteHeaderProps {
  isSaving: boolean;
  isOpen: boolean;
  noteId: string;
  attributes: DraggableAttributes;
  listeners?: SyntheticListenerMap;
  onGenerateQuestions: () => void;
  isGeneratingQuestions: boolean;
  questions: BibleStudyNoteQuestionItemType[];
}

function QuestionsNoteHeader({
  isSaving,
  isOpen,
  noteId,
  attributes,
  listeners,
  onGenerateQuestions,
  isGeneratingQuestions,
}: QuestionsNoteHeaderProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleGenerateClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmGenerate = () => {
    setShowConfirmDialog(false);
    onGenerateQuestions();
  };

  return (
    <NoteCardHeader {...attributes} {...listeners} className="group">
      <div className="flex items-center gap-2">
        <HelpCircle size={16} className="text-purple-500" />
        <Label className="text-sm font-medium">Questions</Label>
      </div>
      <div className="grow" />
      <div className="flex items-center gap-2">
        {isSaving && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="mr-2"
          >
            <BibleStudyNoteSavingIndicator />
          </motion.div>
        )}
        {isGeneratingQuestions ? (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="mr-2 flex items-center gap-1"
          >
            <Loader2 className="h-3 w-3 animate-spin" />
            <span className="text-xs text-muted-foreground">Generating...</span>
          </motion.div>
        ) : (
          <>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 gap-1 text-xs"
              onClick={handleGenerateClick}
              disabled={isGeneratingQuestions}
            >
              <RefreshCw size={12} />
              Generate Questions
            </Button>

            <AlertDialog
              open={showConfirmDialog}
              onOpenChange={setShowConfirmDialog}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    Generate New Questions?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will replace all existing questions and their
                    responses. Any answers you&apos;ve written will be lost. Are
                    you sure you want to generate new questions?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleConfirmGenerate}
                    className="bg-amber-500 hover:bg-amber-600"
                  >
                    Generate New Questions
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}

        <BibleStudyNoteDeleteButton noteId={noteId} />
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
        </CollapsibleTrigger>
      </div>
    </NoteCardHeader>
  );
}
