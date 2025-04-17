import { useCallback, useState } from "react";
import { type z } from "zod";
import {
  type GenerateQuestionsInput,
  type GeneratedQuestion,
} from "../server/services/bible-study-service";
import { api } from "../trpc/react";

export function useGenerateBibleQuestions() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);

  const { mutateAsync: generateQuestionsMutation } =
    api.bibleStudy.generateQuestions.useMutation();

  const generateQuestions = useCallback(
    async (
      input: z.infer<typeof GenerateQuestionsInput>,
      onQuestionGenerated: (question: GeneratedQuestion) => void,
      onComplete?: () => void,
    ) => {
      if (isGenerating) {
        return;
      }

      setIsGenerating(true);
      setQuestions([]);

      try {
        const generator = await generateQuestionsMutation(input);
        for await (const question of generator) {
          onQuestionGenerated(question);
        }
      } catch (error) {
        throw error;
      } finally {
        setIsGenerating(false);
        onComplete?.();
      }
    },
    [isGenerating, generateQuestionsMutation],
  );

  return {
    generateQuestions,
    isGenerating,
    questions,
  };
}
