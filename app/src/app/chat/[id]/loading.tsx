import ChatContainer from "../../../components/chat/chat-container";
import {
  ChatThreadCenterContainer,
  ChatThreadInputContainer,
} from "../../../components/chat/thread/chat-thread-components";
import { Skeleton } from "../../../components/ui/skeleton";

export default function ChatLoading() {
  return (
    <ChatContainer>
      <ChatThreadCenterContainer>
        <div className="flex h-full w-full flex-col space-y-12 p-6 md:p-8">
          {/* User message skeleton */}
          <div className="flex w-full flex-col gap-4">
            <div className="flex items-center justify-end gap-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <div className="flex flex-col items-end gap-2">
              <Skeleton className="h-4 w-full max-w-[75%]" />
              <Skeleton className="h-4 w-full max-w-[85%]" />
            </div>
          </div>
          {/* Assistant message skeleton */}
          <div className="flex w-full flex-col gap-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-5 w-20" />
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-full max-w-[80%]" />
              <Skeleton className="h-4 w-full max-w-[70%]" />
              <Skeleton className="h-4 w-full max-w-[60%]" />
              <Skeleton className="h-4 w-full max-w-[80%]" />
              <Skeleton className="h-4 w-full max-w-[80%]" />
            </div>
          </div>
          {/* User message skeleton */}
          <div className="flex w-full flex-col gap-4">
            <div className="flex items-center justify-end gap-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <div className="flex flex-col items-end gap-2">
              <Skeleton className="h-4 w-full max-w-[85%]" />
              <Skeleton className="h-4 w-full max-w-[75%]" />
            </div>
          </div>
        </div>

        {/* Input skeleton */}
        <ChatThreadInputContainer>
          <Skeleton className="h-24 w-full rounded-md" />
        </ChatThreadInputContainer>
      </ChatThreadCenterContainer>
    </ChatContainer>
  );
}
