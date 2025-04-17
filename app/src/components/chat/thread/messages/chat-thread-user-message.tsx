import { type ChatMessage } from "@prisma/client";
import { ChatThreadMessage } from "../chat-thread-components";

type Props = {
  message: ChatMessage;
};

export default function ChatThreadUserMessage({ message }: Props) {
  if (message.content === "") {
    return null;
  }

  return (
    <div className="flex justify-end">
      <ChatThreadMessage className="rounded-lg bg-muted p-2">
        {message.content}
      </ChatThreadMessage>
    </div>
  );
}
