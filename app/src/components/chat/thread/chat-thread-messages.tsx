"use client";

import { type ChatMessage, ChatMessageRole } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { memo } from "react";
import {
  ChatThreadMessage,
  ChatThreadMessagesContainer,
} from "./chat-thread-components";
import { ChatThreadAssistantMessage } from "./messages/chat-thread-assistant-message";
import { ChatThreadUserMessage } from "./messages/chat-thread-user-message";

export const ChatThreadMessages = memo(ChatThreadMessagesImpl, (prev, next) => {
  return (
    prev.messages === next.messages &&
    prev.isSendingMessage === next.isSendingMessage
  );
});

type Props = {
  messages: ChatMessage[];
  isSendingMessage: boolean;
};

function ChatThreadMessagesImpl({ messages, isSendingMessage }: Props) {
  return (
    <ChatThreadMessagesContainer>
      {messages.map((message) => {
        switch (message.role) {
          case ChatMessageRole.ASSISTANT:
            return (
              <ChatThreadAssistantMessage
                key={message.id}
                message={message}
                isStreaming={
                  isSendingMessage &&
                  message.id === messages[messages.length - 1]?.id
                }
              />
            );
          case ChatMessageRole.USER:
            return <ChatThreadUserMessage key={message.id} message={message} />;
          default:
            return null;
        }
      })}
      {isSendingMessage && messages[messages.length - 1]?.content === "" && (
        <LumenThinkingMessage />
      )}
    </ChatThreadMessagesContainer>
  );
}

function LumenThinkingMessage() {
  return (
    <div className="flex justify-start">
      <ChatThreadMessage className="mb-4 flex flex-row items-center gap-2 bg-transparent px-0">
        <div className="flex">
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-full border bg-muted/50 p-1.5">
              <Loader2 className="size-4 animate-spin" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              Lumen is thinking...
            </span>
          </div>
        </div>
      </ChatThreadMessage>
    </div>
  );
}
