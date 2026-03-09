import ChatContainer from "../../components/chat/chat-container";
import { api, HydrateClient } from "../../trpc/server";

export default async function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await api.chat.getThreads.prefetch();

  return (
    <HydrateClient>
      <ChatContainer>{children}</ChatContainer>
    </HydrateClient>
  );
}
