"use client";

import { useContext } from "react";
import {
  ChatThreadContext,
  type ChatThreadContextType,
} from "./chat-thread-context";

export function useChatThreadContext(): ChatThreadContextType {
  return useContext(ChatThreadContext);
}
