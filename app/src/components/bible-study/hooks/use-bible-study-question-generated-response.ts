"use client";

import { useState } from "react";
import { api } from "../../../trpc/react";
import useModelContext from "../../model/use-model-context";

export function useBibleStudyQuestionGeneratedResponse() {
  const [isLoading, setIsLoading] = useState(false);
  const { mutateAsync: generateResponseMutation } =
    api.bibleStudy.generateQuestionResponse.useMutation();
  const { model } = useModelContext();

  async function generateResponse(
    noteId: string,
    questionIndex: number,
    question: string,
    onChunk: (chunk: string) => void,
  ) {
    setIsLoading(true);
    let aborted = false;

    try {
      const generator = await generateResponseMutation({
        noteId,
        questionIndex,
        question,
        model: model ?? undefined,
      });

      for await (const chunk of generator) {
        if (aborted) break;

        if (chunk) {
          onChunk(typeof chunk === "string" ? chunk : "");
        }
      }
    } catch {
      onChunk(
        "\n\nSorry, there was an error generating a response. Please try again.",
      );
    } finally {
      if (!aborted) {
        setIsLoading(false);
      }
    }

    return () => {
      aborted = true;
      setIsLoading(false);
    };
  }

  return { generateResponse, isLoading };
}
