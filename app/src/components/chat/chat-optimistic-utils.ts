"use client";

import type { ChatMessage, ChatMessageRole, ChatThread } from "@prisma/client";
import { uniqueId } from "lodash";

export function createOptimisticThread(threadId: string): ChatThread {
  return {
    id: threadId,
    title: "New Chat",
    user_id: "optimistic-user",
    created_at: new Date(),
    updated_at: new Date(),
  };
}

export function createOptimisticMessage(
  role: ChatMessageRole,
  content: string,
  threadId: string,
  id = uniqueId(),
): ChatMessage {
  return {
    id,
    role,
    thread_id: threadId,
    content,
    created_at: new Date(),
    updated_at: new Date(),
  };
}
