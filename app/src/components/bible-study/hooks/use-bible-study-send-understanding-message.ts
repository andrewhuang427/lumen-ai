"use client";

import { useState } from "react";
import { api } from "../../../trpc/react";
import useModelContext from "../../model/use-model-context";

export function useBibleStudySendUnderstandingMessage() {
  const [isLoading, setIsLoading] = useState(false);

  const { mutateAsync: sendMessageMutation } =
    api.bibleStudy.sendUnderstandingMessage.useMutation();
  const { model } = useModelContext();

  async function sendMessage(
    noteId: string,
    message: string,
    onChunk: (chunk: string) => void,
  ) {
    setIsLoading(true);
    const generator = await sendMessageMutation({
      noteId,
      message,
      model: model ?? undefined,
    });
    for await (const chunk of generator) {
      onChunk(chunk);
    }
    setIsLoading(false);
  }

  return { sendMessage, isLoading };
}
