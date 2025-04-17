import ChatContainer from "../../../components/chat/chat-container";
import ChatThread from "../../../components/chat/thread/chat-thread";
import ChatThreadContextProvider from "../../../components/chat/thread/chat-thread-context-provider";
import { api, HydrateClient } from "../../../trpc/server";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ChatThreadPage({ params }: Props) {
  const id = (await params).id;
  await Promise.all([
    api.chat.getThread.prefetch(id),
    api.chat.getThreads.prefetch(),
  ]);

  return (
    <HydrateClient>
      <ChatThreadContextProvider threadId={id}>
        <ChatContainer>
          <ChatThread />
        </ChatContainer>
      </ChatThreadContextProvider>
    </HydrateClient>
  );
}
