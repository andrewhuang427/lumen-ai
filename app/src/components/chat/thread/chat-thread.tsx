"use client";

import { MessagesSquare } from "lucide-react";
import {
  ChatThreadCenterContainer,
  ChatThreadContainer,
  ChatThreadContent,
  ChatThreadHeader,
  ChatThreadInputContainer,
} from "./chat-thread-components";
import ChatThreadInput from "./chat-thread-input";
import ChatThreadMessages from "./chat-thread-messages";
import { useChatThreadContext } from "./use-chat-thread-context";

export default function ChatThread() {
  const { thread, isSendingMessage } = useChatThreadContext();

  return (
    <ChatThreadContainer>
      <ChatThreadHeader>
        <MessagesSquare className="mr-2 size-4" />
        {thread?.title}
      </ChatThreadHeader>
      <ChatThreadContent>
        <ChatThreadCenterContainer>
          <ChatThreadMessages />
          <ChatThreadInputContainer isSendingMessage={isSendingMessage}>
            <ChatThreadInput />
          </ChatThreadInputContainer>
        </ChatThreadCenterContainer>
      </ChatThreadContent>
    </ChatThreadContainer>
  );
}
