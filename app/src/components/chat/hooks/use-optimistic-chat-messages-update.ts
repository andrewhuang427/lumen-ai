"use client";

import type { ChatMessageRole } from "@prisma/client";
import { api } from "../../../trpc/react";
import { createOptimisticMessage } from "../chat-optimistic-utils";

export default function useOptimisticChatMessagesUpdate() {
  const utils = api.useUtils();

  function optimisticChatMessagesUpdate(
    threadId: string,
    role: ChatMessageRole,
    content: string,
  ) {
    utils.chat.getThread.setData(threadId, (previousThread) => {
      if (!previousThread) {
        return previousThread;
      }

      return {
        ...previousThread,
        messages: [
          ...previousThread.messages,
          createOptimisticMessage(role, content, threadId),
        ],
      };
    });
  }

  return {
    optimisticChatMessagesUpdate,
  };
}
