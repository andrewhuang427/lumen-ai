"use client";

import { ChatMessageRole, type ChatMessage, type ChatThread } from "@prisma/client";
import { Loader2, Send } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import { uniqueId } from "lodash";
import { useRef, useState } from "react";
import { cn } from "~/lib/utils";
import { api } from "../../trpc/react";
import useModelContext from "../model/use-model-context";
import { ModelSelector } from "../model/model-selector";
import {
  AutosizeTextarea,
  type AutosizeTextAreaRef,
} from "../ui/autosize-textarea";
import { Button } from "../ui/button";
import ChatCreateThreadSuggestedPrompts from "./chat-create-thread-suggested-prompts";

export default function ChatCreateThreadInput() {
  const [initialMessage, setInitialMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const textareaRef = useRef<AutosizeTextAreaRef>(null);
  const router = useRouter();
  const { model, isWebSearchEnabled } = useModelContext();

  const { mutateAsync: createThread } = api.chat.createThread.useMutation();
  const utils = api.useUtils();

  async function handleCreateThread() {
    const trimmedInitialMessage = initialMessage.trim();
    if (trimmedInitialMessage.length === 0) {
      return;
    }

    setIsLoading(true);
    try {
      // 1. optimistically create a new thread
      const dummyThread = {
        id: `optimistic-${Date.now()}`,
        title: "New Chat",
        user_id: "optimistic-user",
        created_at: new Date(),
        updated_at: new Date(),
      };
      utils.chat.getThreads.setData(undefined, (threads) => [
        dummyThread,
        ...(threads ?? []),
      ]);

      // 2. create the actual thread and stream its first response
      const generator = await createThread({
        initialMessage: trimmedInitialMessage,
        model: model ?? undefined,
        isWebSearchEnabled,
      });

      let threadId: string | null = null;

      for await (const chunk of generator) {
        if (chunk.type === "new-thread") {
          threadId = chunk.threadId;

          const optimisticThread = getOptimisticThread(chunk.threadId);
          const optimisticMessages = [
            getDummyMessage(
              ChatMessageRole.USER,
              trimmedInitialMessage,
              chunk.threadId,
            ),
            getDummyMessage(ChatMessageRole.ASSISTANT, "", chunk.threadId),
          ];

          utils.chat.getThreads.setData(undefined, (threads) => {
            const filtered = threads?.filter((t) => t.id !== dummyThread.id) ?? [];
            return [optimisticThread, ...filtered];
          });

          utils.chat.getThread.setData(chunk.threadId, {
            ...optimisticThread,
            messages: optimisticMessages,
          });

          router.push(`/chat/${chunk.threadId}`);
          continue;
        }

        if (chunk.type === "message" && threadId != null) {
          const activeThreadId = threadId;
          utils.chat.getThread.setData(threadId, (existingThread) => {
            if (!existingThread) {
              return existingThread;
            }

            return {
              ...existingThread,
              messages: appendAssistantChunk(
                existingThread.messages,
                chunk.content,
                activeThreadId,
              ),
            };
          });
          continue;
        }

        if (chunk.type === "new-thread-title") {
          utils.chat.getThreads.setData(undefined, (threads) =>
            threads?.map((thread) =>
              thread.id === chunk.threadId
                ? { ...thread, title: chunk.title }
                : thread,
            ) ?? [],
          );

          utils.chat.getThread.setData(chunk.threadId, (existingThread) => {
            if (!existingThread) {
              return existingThread;
            }

            return {
              ...existingThread,
              title: chunk.title,
            };
          });
        }
      }

      if (threadId != null) {
        await Promise.all([
          utils.chat.getThread.invalidate(threadId),
          utils.chat.getThreads.invalidate(),
        ]);
      }
    } catch {
      utils.chat.getThreads.setData(undefined, (threads) => {
        return threads?.filter((t) => !t.id.startsWith("optimistic-")) ?? [];
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="flex w-full max-w-3xl flex-col gap-4 p-4">
        <div className="mb-4 flex flex-col items-center gap-2 text-center">
          <h2 className="text-2xl font-medium tracking-tight">
            What can Lumen help you with?
          </h2>
          <p className="text-center text-sm text-muted-foreground">
            Lumen is your AI companion for studying and understanding scripture.
          </p>
        </div>
        <div
          className={cn(
            "relative flex w-full flex-col gap-2 rounded-lg border bg-sidebar p-2",
            isLoading && "shine-border shine-border-active",
          )}
        >
          <AutosizeTextarea
            ref={textareaRef}
            value={initialMessage}
            onChange={(e) => setInitialMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void handleCreateThread();
              }
            }}
            className="!max-h-48 w-full resize-none overflow-y-auto border-none bg-transparent outline-none focus:ring-0 focus-visible:ring-0"
            placeholder="Ask Lumen anything about the Bible..."
          />
          <div className="flex w-full items-end gap-2">
            <ModelSelector />
            {/* <WebSearchToggle /> */}
            <div className="grow" />
            <Button
              variant="outline"
              size="icon"
              onClick={handleCreateThread}
              disabled={isLoading || initialMessage.trim().length === 0}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        <ChatCreateThreadSuggestedPrompts
          textareaRef={textareaRef}
          onSetInitialMessage={setInitialMessage}
        />
        <div className="flex items-center justify-center text-center">
          <p className="max-w-lg text-xs text-muted-foreground">
            Compare responses with scripture and trusted sources.
          </p>
        </div>
      </div>
    </div>
  );
}

function getOptimisticThread(threadId: string): ChatThread {
  return {
    id: threadId,
    title: "New Chat",
    user_id: "optimistic-user",
    created_at: new Date(),
    updated_at: new Date(),
  };
}

function getDummyMessage(
  role: ChatMessageRole,
  content: string,
  threadId: string,
): ChatMessage {
  return {
    id: uniqueId(),
    role,
    thread_id: threadId,
    content,
    created_at: new Date(),
    updated_at: new Date(),
  };
}

function appendAssistantChunk(
  messages: ChatMessage[],
  chunk: string,
  threadId: string,
) {
  const lastMessage = messages[messages.length - 1];

  if (lastMessage?.role !== ChatMessageRole.ASSISTANT) {
    return [
      ...messages,
      getDummyMessage(ChatMessageRole.ASSISTANT, chunk, threadId),
    ];
  }

  return [
    ...messages.slice(0, -1),
    {
      ...lastMessage,
      content: lastMessage.content + chunk,
      updated_at: new Date(),
    },
  ];
}
