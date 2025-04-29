"use client";

import { type ChatMessage } from "@prisma/client";
import { createContext, createRef } from "react";
import { type ChatThreadWithMessages } from "../../../server/services/chat-service";

export type ChatThreadContextType = {
  bottomRef: React.RefObject<HTMLDivElement>;
  threadId: string;
  thread: ChatThreadWithMessages | null;
  messages: ChatMessage[];
  isLoading: boolean;
  isSendingMessage: boolean;
  onSendMessage: (message: string) => Promise<void>;
};

export const ChatThreadContext = createContext<ChatThreadContextType>({
  bottomRef: createRef<HTMLDivElement>(),
  threadId: "",
  thread: null,
  messages: [],
  isLoading: false,
  isSendingMessage: false,
  onSendMessage: async () => {},
});
