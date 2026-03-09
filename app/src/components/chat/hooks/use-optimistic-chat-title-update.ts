"use client";

import { api } from "../../../trpc/react";

export default function useOptimisticChatTitleUpdate() {
  const utils = api.useUtils();

  function optimisticChatTitleUpdate(threadId: string, title: string) {
    utils.chat.getThreads.setData(undefined, (previousThreads) => {
      return previousThreads?.map((thread) =>
        thread.id === threadId ? { ...thread, title } : thread,
      );
    });

    utils.chat.getThread.setData(threadId, (previousThread) => {
      if (!previousThread) {
        return previousThread;
      }

      return {
        ...previousThread,
        title,
      };
    });
  }

  return {
    optimisticChatTitleUpdate,
  };
}
