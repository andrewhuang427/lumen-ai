"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import SquareLogo from "../../../square-logo";
import { Button } from "../../../ui/button";
import { useBibleStudyQuestionGeneratedResponse } from "../../hooks/use-bible-study-question-generated-response";

interface BibleStudyNoteQuestionGeneratedResponseProps {
  noteId: string;
  questionIndex: number;
  question: string;
  initialGeneratedResponse?: string;
  onResponseGenerated?: (response: string) => void;
}

export function BibleStudyNoteQuestionGeneratedResponse({
  noteId,
  questionIndex,
  question,
  initialGeneratedResponse,
  onResponseGenerated,
}: BibleStudyNoteQuestionGeneratedResponseProps) {
  const [responseContent, setResponseContent] = useState(
    initialGeneratedResponse ?? "",
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const [isVisible, setIsVisible] = useState(!!initialGeneratedResponse);

  const { generateResponse, isLoading: isGeneratingResponse } =
    useBibleStudyQuestionGeneratedResponse();
  const abortRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    return () => abortRef.current?.();
  }, []);

  useEffect(() => {
    if (!isGenerating && responseContent && onResponseGenerated) {
      onResponseGenerated(responseContent);
    }
  }, [isGenerating, responseContent, onResponseGenerated]);

  useEffect(() => {
    if (!isGenerating) return;

    const interval = setInterval(() => setShowCursor((prev) => !prev), 500);
    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleGenerateResponse = async () => {
    if (isGenerating) return;

    abortRef.current?.();
    abortRef.current = null;

    setIsGenerating(true);
    setIsVisible(true);
    setResponseContent("");

    try {
      abortRef.current = await generateResponse(
        noteId,
        questionIndex,
        question,
        (chunk: string) => {
          setTimeout(() => setResponseContent((prev) => prev + chunk), 10);
        },
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="mt-2 flex flex-col gap-2">
      {!isVisible ? (
        <div className="flex items-center justify-start">
          <Button
            variant="secondary"
            onClick={handleGenerateResponse}
            disabled={isGenerating || isGeneratingResponse}
          >
            <SquareLogo size={20} />
            What does Lumen think?
          </Button>
        </div>
      ) : (
        <div className="border-primary/20shadow-sm flex flex-col gap-2 rounded-lg border">
          <div className="flex items-center justify-between rounded-t-lg bg-primary/15 px-4 py-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <SquareLogo size={20} />
              <span className="text-primary">Lumen&apos;s Response</span>
            </div>
            {!isGenerating && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs hover:bg-primary/10"
                onClick={handleGenerateResponse}
                disabled={isGenerating || isGeneratingResponse}
              >
                Regenerate
              </Button>
            )}
          </div>
          <div className="px-4 pb-3 pt-1">
            {isGenerating && responseContent.length === 0 ? (
              <div className="flex items-center justify-center py-2">
                <Loader2 size={16} className="animate-spin text-primary/60" />
              </div>
            ) : (
              <div className="whitespace-pre-wrap text-xs leading-relaxed">
                {responseContent}
                {isGenerating && showCursor && (
                  <span className="animate-pulse text-primary">|</span>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
