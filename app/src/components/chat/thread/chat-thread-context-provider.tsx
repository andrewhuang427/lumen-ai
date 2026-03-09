"use client";

import { ChatMessageRole } from "@prisma/client";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type PropsWithChildren,
} from "react";
import { api } from "../../../trpc/react";
import { createOptimisticMessage } from "../chat-optimistic-utils";
import { chatStreamStore, useChatStreamStore } from "../chat-stream-store";
import useOptimisticChatMessagesUpdate from "../hooks/use-optimistic-chat-messages-update";
import useModelContext from "../../model/use-model-context";
import {
  ChatThreadContext,
  type ChatThreadContextType,
} from "./chat-thread-context";

export default function ChatThreadContextProvider({
  threadId,
  children,
}: PropsWithChildren<{ threadId: string }>) {
  const { model, isWebSearchEnabled } = useModelContext();
  const { optimisticChatMessagesUpdate } = useOptimisticChatMessagesUpdate();
  const { isStreaming, threadIdToStreamingMessage } = useChatStreamStore();

  const bottomRef = useRef<HTMLDivElement>(null);

  const { data: thread = null, isLoading } = api.chat.getThread.useQuery(threadId);

  const { mutateAsync: sendMessageMutation } =
    api.chat.sendMessage.useMutation();

  const utils = api.useUtils();
  const isSendingMessage = isStreaming[threadId] === true;
  const streamingMessage = threadIdToStreamingMessage[threadId] ?? "";

  const messages = useMemo(() => {
    const persistedMessages = thread?.messages ?? [];

    if (!isSendingMessage) {
      return persistedMessages;
    }

    return [
      ...persistedMessages,
      createOptimisticMessage(
        ChatMessageRole.ASSISTANT,
        streamingMessage,
        threadId,
        `streaming-${threadId}`,
      ),
    ];
  }, [thread?.messages, isSendingMessage, streamingMessage, threadId]);

  const sendMessage = useCallback(
    async (message: string) => {
      const trimmedMessage = message.trim();
      if (trimmedMessage.length === 0) {
        return;
      }

      await utils.chat.getThread.cancel(threadId);
      optimisticChatMessagesUpdate(threadId, ChatMessageRole.USER, trimmedMessage);
      chatStreamStore.startStreaming(threadId);

      let didComplete = false;
      try {
        const generator = await sendMessageMutation({
          threadId,
          message: trimmedMessage,
          model: model ?? undefined,
          isWebSearchEnabled,
        });

        for await (const chunk of generator) {
          chatStreamStore.appendToken(threadId, chunk);
        }

        didComplete = true;
      } finally {
        const assistantContent =
          chatStreamStore.getState().threadIdToStreamingMessage[threadId] ?? "";

        chatStreamStore.clearStreaming(threadId);

        if (didComplete && assistantContent.length > 0) {
          optimisticChatMessagesUpdate(
            threadId,
            ChatMessageRole.ASSISTANT,
            assistantContent,
          );
        }

        void utils.chat.getThread.invalidate(threadId);
        void utils.chat.getThreads.invalidate();
      }
    },
    [
      model,
      isWebSearchEnabled,
      optimisticChatMessagesUpdate,
      sendMessageMutation,
      threadId,
      utils.chat.getThread,
      utils.chat.getThreads,
    ],
  );

  const lastMessageContent = messages[messages.length - 1]?.content;

  useEffect(() => {
    requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    });
  }, [messages.length, lastMessageContent]);

  const contextValue: ChatThreadContextType = useMemo(
    () => ({
      bottomRef,
      threadId,
      thread,
      messages,
      isLoading,
      isSendingMessage,
      onSendMessage: sendMessage,
    }),
    [threadId, thread, messages, isLoading, isSendingMessage, sendMessage],
  );

  return (
    <ChatThreadContext.Provider value={contextValue}>
      {children}
    </ChatThreadContext.Provider>
  );
}
