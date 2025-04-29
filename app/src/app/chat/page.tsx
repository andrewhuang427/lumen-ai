import ChatContainer from "../../components/chat/chat-container";
import ChatCreateThreadInput from "../../components/chat/chat-create-thread-input";
import { api, HydrateClient } from "../../trpc/server";

export default async function ChatPage() {
  await api.chat.getThreads.prefetch();

  return (
    <HydrateClient>
      <ChatContainer>
        <ChatCreateThreadInput />
      </ChatContainer>
    </HydrateClient>
  );
}
