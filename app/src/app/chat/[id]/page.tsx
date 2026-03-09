import ChatThread from "../../../components/chat/thread/chat-thread";
import ChatThreadContextProvider from "../../../components/chat/thread/chat-thread-context-provider";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ChatThreadPage({ params }: Props) {
  const id = (await params).id;

  return (
    <ChatThreadContextProvider threadId={id}>
      <ChatThread />
    </ChatThreadContextProvider>
  );
}
