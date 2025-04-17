import ChatContainer from "../../components/chat/chat-container";
import ChatCreateThreadInput from "../../components/chat/chat-create-thread-input";
import ChatHeader from "../../components/chat/chat-header";
import { api, HydrateClient } from "../../trpc/server";

export default async function ChatPage() {
  await api.chat.getThreads.prefetch();

  return (
    <HydrateClient>
      <ChatContainer>
        <ChatHeader />
        <ChatCreateThreadInput />
      </ChatContainer>
    </HydrateClient>
  );
}
