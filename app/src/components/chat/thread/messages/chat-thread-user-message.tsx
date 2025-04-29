import { type ChatMessage } from "@prisma/client";
import { memo } from "react";
import { ChatThreadMessage } from "../chat-thread-components";

type Props = {
  message: ChatMessage;
};

export const ChatThreadUserMessage = memo(
  ChatThreadUserMessageImpl,
  (prev, next) => {
    return prev.message.content === next.message.content;
  },
);

function ChatThreadUserMessageImpl({ message }: Props) {
  if (message.content === "") {
    return null;
  }

  return (
    <div className="flex justify-end">
      <ChatThreadMessage className="rounded-lg bg-muted p-2.5 leading-6">
        {message.content}
      </ChatThreadMessage>
    </div>
  );
}
