"use client";

import { ChatMessageRole, type ChatMessage } from "@prisma/client";
import { uniqueId } from "lodash";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";
import { api } from "../../../trpc/react";
import useModelContext from "../../model/use-model-context";
import {
  ChatThreadContext,
  type ChatThreadContextType,
} from "./chat-thread-context";

export default function ChatThreadContextProvider({
  threadId,
  children,
}: PropsWithChildren<{ threadId: string }>) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const { model, isWebSearchEnabled } = useModelContext();

  const bottomRef = useRef<HTMLDivElement>(null);

  const {
    data: thread = null,
    isLoading,
    refetch: refetchThread,
  } = api.chat.getThread.useQuery(threadId);

  const { mutateAsync: sendMessageMutation } =
    api.chat.sendMessage.useMutation();

  const utils = api.useUtils();

  const refetchThreadAndUpdateCache = useCallback(async () => {
    const { data: updatedThread } = await refetchThread();
    if (updatedThread != null) {
      utils.chat.getThreads.setData(undefined, (threads) => {
        return threads?.map((t) => (t.id === threadId ? updatedThread : t));
      });
    }
  }, [threadId, utils, refetchThread]);

  const sendMessage = useCallback(
    async (message?: string) => {
      if (message != null) {
        setMessages((prev) => [
          ...prev,
          getDummyMessage(ChatMessageRole.USER, message, threadId),
        ]);
      }

      try {
        setIsSendingMessage(true);
        let response = "";
        setMessages((prev) => [
          ...prev,
          getDummyMessage(ChatMessageRole.ASSISTANT, response, threadId),
        ]);
        requestAnimationFrame(() => {
          bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        });
        const generator = await sendMessageMutation({
          threadId,
          message,
          model: model ?? undefined,
          isWebSearchEnabled,
        });
        for await (const chunk of generator) {
          response += chunk;
          setMessages((prev) => {
            return [
              ...prev.slice(0, -1),
              getDummyMessage(ChatMessageRole.ASSISTANT, response, threadId),
            ];
          });
        }
        void refetchThreadAndUpdateCache();
      } finally {
        setIsSendingMessage(false);
      }
    },
    [
      threadId,
      model,
      isWebSearchEnabled,
      sendMessageMutation,
      refetchThreadAndUpdateCache,
    ],
  );

  // update messages state when thread changes
  useEffect(() => {
    if (thread?.messages != null) {
      setMessages((previousMessages) =>
        shouldUseIncomingMessages(previousMessages, thread.messages)
          ? thread.messages
          : previousMessages,
      );
    }
  }, [thread?.messages]);

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

function shouldUseIncomingMessages(
  previousMessages: ChatMessage[],
  incomingMessages: ChatMessage[],
) {
  if (previousMessages.length === 0) {
    return true;
  }

  if (incomingMessages.length > previousMessages.length) {
    return true;
  }

  if (incomingMessages.length < previousMessages.length) {
    return false;
  }

  const previousLastMessage = previousMessages[previousMessages.length - 1];
  const incomingLastMessage = incomingMessages[incomingMessages.length - 1];

  if (
    previousLastMessage?.role === ChatMessageRole.ASSISTANT &&
    incomingLastMessage?.role === ChatMessageRole.ASSISTANT &&
    incomingLastMessage.content.length < previousLastMessage.content.length
  ) {
    return false;
  }

  return true;
}

function getDummyMessage(
  role: ChatMessageRole,
  content: string,
  threadId: string,
) {
  return {
    id: uniqueId(),
    role,
    thread_id: threadId,
    content,
    created_at: new Date(),
    updated_at: new Date(),
  };
}
