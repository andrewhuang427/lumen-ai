"use client";

import {
  ChatThreadCenterContainer,
  ChatThreadContainer,
  ChatThreadContent,
  ChatThreadInputContainer,
} from "./chat-thread-components";
import ChatThreadInput from "./chat-thread-input";
import ChatThreadLoadingState from "./chat-thread-loading-state";
import { ChatThreadMessages } from "./chat-thread-messages";
import { useChatThreadContext } from "./use-chat-thread-context";

export default function ChatThread() {
  const { bottomRef, messages, isLoading, thread, isSendingMessage } =
    useChatThreadContext();

  if (isLoading && thread == null && messages.length === 0) {
    return (
      <ChatThreadContainer>
        <ChatThreadContent>
          <ChatThreadLoadingState />
        </ChatThreadContent>
      </ChatThreadContainer>
    );
  }

  return (
    <ChatThreadContainer>
      <ChatThreadContent>
        <ChatThreadCenterContainer>
          <ChatThreadMessages
            messages={messages}
            isSendingMessage={isSendingMessage}
          />
          <div ref={bottomRef} />
          <ChatThreadInputContainer isSendingMessage={isSendingMessage}>
            <ChatThreadInput />
          </ChatThreadInputContainer>
        </ChatThreadCenterContainer>
      </ChatThreadContent>
    </ChatThreadContainer>
  );
}
