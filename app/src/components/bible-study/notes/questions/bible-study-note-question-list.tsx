"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Fragment, useState } from "react";
import {
  BibleStudyNoteQuestionItem,
  type BibleStudyNoteQuestionItemType,
} from "./bible-study-note-question-item";
import { Separator } from "../../../ui/separator";

interface BibleStudyNoteQuestionListProps {
  noteId: string;
  questions: BibleStudyNoteQuestionItemType[];
  isLoading: boolean;
  onUpdateResponse: (index: number, response: string) => void;
  onRemoveQuestion: (index: number) => void;
  onUpdateGeneratedResponse: (index: number, generatedResponse: string) => void;
}

export function BibleStudyNoteQuestionList({
  noteId,
  questions,
  isLoading,
  onUpdateResponse,
  onRemoveQuestion,
  onUpdateGeneratedResponse,
}: BibleStudyNoteQuestionListProps) {
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <AnimatePresence>
        {questions.map((item, index) => (
          <Fragment key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                duration: 0.3,
                delay: index * 0.1,
                ease: "easeOut",
              }}
            >
              <BibleStudyNoteQuestionItem
                noteId={noteId}
                item={item}
                index={index}
                isActive={activeQuestion === index}
                isLoading={isLoading}
                onUpdateResponse={onUpdateResponse}
                onRemove={onRemoveQuestion}
                onFocus={(idx) => setActiveQuestion(idx)}
                onBlur={() => setActiveQuestion(null)}
                onUpdateGeneratedResponse={onUpdateGeneratedResponse}
              />
            </motion.div>
            {index < questions.length - 1 && <Separator />}
          </Fragment>
        ))}
      </AnimatePresence>
    </div>
  );
}
