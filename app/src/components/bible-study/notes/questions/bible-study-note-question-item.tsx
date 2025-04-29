"use client";

import { Trash } from "lucide-react";
import { useCallback } from "react";
import { AutosizeTextarea } from "../../../ui/autosize-textarea";
import { Button } from "../../../ui/button";
import { BibleStudyNoteQuestionGeneratedResponse } from "./bible-study-note-question-generated-response";

export type BibleStudyNoteQuestionItemType = {
  question: string;
  response: string;
  verses: string[];
  generatedResponse?: string;
  isGeneratingResponse?: boolean;
};

interface BibleStudyNoteQuestionItemProps {
  noteId: string;
  item: BibleStudyNoteQuestionItemType;
  index: number;
  isActive: boolean;
  isLoading: boolean;
  onUpdateResponse: (index: number, response: string) => void;
  onRemove: (index: number) => void;
  onFocus: (index: number) => void;
  onBlur: () => void;
  onUpdateGeneratedResponse: (index: number, generatedResponse: string) => void;
}

export function BibleStudyNoteQuestionItem({
  noteId,
  item,
  index,
  onUpdateResponse,
  onRemove,
  onFocus,
  onBlur,
  onUpdateGeneratedResponse,
}: BibleStudyNoteQuestionItemProps) {
  const handleResponseChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdateResponse(index, e.target.value);
  };

  const handleGeneratedResponse = useCallback(
    (response: string) => {
      onUpdateGeneratedResponse?.(index, response);
    },
    [index, onUpdateGeneratedResponse],
  );

  return (
    <div className="flex flex-col gap-4">
      <QuestionNumberIndicator index={index} />
      <div className="flex items-center justify-between gap-2">
        <h4 className="text-sm font-medium">{item.question}</h4>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground opacity-60 transition-opacity hover:text-destructive hover:opacity-100"
            onClick={() => onRemove(index)}
          >
            <Trash size={14} />
          </Button>
        </div>
      </div>

      {item.verses.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {item.verses.map((verse, i) => (
            <div
              key={i}
              className="inline-flex items-center rounded border bg-muted px-2 py-1 text-xs font-medium"
            >
              {verse}
            </div>
          ))}
        </div>
      )}
      <div className="relative">
        <div className="absolute left-4 top-4 text-xs font-medium">
          Your Response
        </div>
        <AutosizeTextarea
          value={item.response}
          onChange={handleResponseChange}
          onFocus={() => onFocus(index)}
          onBlur={onBlur}
          placeholder="Write your response here..."
          className="min-h-[100px] resize-none rounded-md border p-4 pt-12 shadow-sm transition-colors focus-visible:shadow"
        />
      </div>
      <BibleStudyNoteQuestionGeneratedResponse
        noteId={noteId}
        questionIndex={index}
        question={item.question}
        initialGeneratedResponse={item.generatedResponse}
        onResponseGenerated={handleGeneratedResponse}
      />
    </div>
  );
}

type QuestionNumberIndicatorProps = {
  index: number;
};

function QuestionNumberIndicator({ index }: QuestionNumberIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="rounded bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
        Question {index + 1}
      </div>
    </div>
  );
}
