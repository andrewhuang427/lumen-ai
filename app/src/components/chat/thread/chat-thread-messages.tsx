"use client";

import { ChatMessageRole } from "@prisma/client";
import { Loader2 } from "lucide-react";
import {
  ChatThreadMessage,
  ChatThreadMessagesContainer,
} from "./chat-thread-components";
import ChatThreadAssistantMessage from "./messages/chat-thread-assistant-message";
import ChatThreadUserMessage from "./messages/chat-thread-user-message";
import { useChatThreadContext } from "./use-chat-thread-context";

export default function ChatThreadMessages() {
  const { messages, isSendingMessage } = useChatThreadContext();

  return (
    <ChatThreadMessagesContainer>
      {messages.map((message) => {
        switch (message.role) {
          case ChatMessageRole.ASSISTANT:
            return (
              <ChatThreadAssistantMessage key={message.id} message={message} />
            );
          case ChatMessageRole.USER:
            return <ChatThreadUserMessage key={message.id} message={message} />;
          default:
            return null;
        }
      })}
      {isSendingMessage && messages[messages.length - 1]?.content === "" && (
        <BibleBuddyThinkingMessage />
      )}
    </ChatThreadMessagesContainer>
  );
}

function BibleBuddyThinkingMessage() {
  return (
    <div className="flex justify-start">
      <ChatThreadMessage className="my-4 flex flex-row items-center gap-2 bg-transparent">
        <Loader2 className="size-4 animate-spin" />
        <span className="text-sm text-muted-foreground">
          Lumen AI is thinking...
        </span>
      </ChatThreadMessage>
    </div>
  );
}
