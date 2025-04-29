"use client";

import {
  ChatThreadCenterContainer,
  ChatThreadContainer,
  ChatThreadContent,
  ChatThreadInputContainer,
} from "./chat-thread-components";
import ChatThreadInput from "./chat-thread-input";
import { ChatThreadMessages } from "./chat-thread-messages";
import { useChatThreadContext } from "./use-chat-thread-context";

export default function ChatThread() {
  const { bottomRef, messages, isSendingMessage } = useChatThreadContext();

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
