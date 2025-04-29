"use client";

import { type ChatThread } from "@prisma/client";
import { MessageCirclePlus } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";
import { cn } from "../../lib/utils";
import { api } from "../../trpc/react";
import Header from "../header/header";
import { Button } from "../ui/button";
import { ResizableHandle, ResizablePanel } from "../ui/resizable";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { groupThreadsByDate } from "./chat-utils";

export default function ChatThreadsSidebar() {
  const { data: threads } = api.chat.getThreads.useQuery();

  const groupedThreads = useMemo(() => {
    return groupThreadsByDate(threads ?? []);
  }, [threads]);

  return (
    <>
      <ResizablePanel className="flex min-w-[300px] flex-col">
        <Header
          title="Chats"
          end={
            <Link href="/chat" prefetch={true}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 shrink-0"
                    >
                      <MessageCirclePlus className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Create a new thread</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Link>
          }
          showBorder={false}
        />
        <div className="flex grow flex-col gap-2 overflow-auto p-4 pt-0">
          {threads?.length === 0 ? (
            <div className="flex flex-1 items-center justify-center text-center">
              <span className="text-sm text-muted-foreground">
                Currently no threads found
              </span>
            </div>
          ) : (
            <>
              {groupedThreads.today.length > 0 && (
                <ThreadGroup title="Today" threads={groupedThreads.today} />
              )}
              {groupedThreads.yesterday.length > 0 && (
                <ThreadGroup
                  title="Yesterday"
                  threads={groupedThreads.yesterday}
                />
              )}
              {groupedThreads.older.length > 0 && (
                <ThreadGroup title="Older" threads={groupedThreads.older} />
              )}
            </>
          )}
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle={true} />
    </>
  );
}

function ThreadGroup({
  title,
  threads,
}: {
  title: string;
  threads: ChatThread[];
}) {
  return (
    <div className="mt-2">
      <h3 className="mb-1 px-2 text-xs font-medium text-muted-foreground">
        {title}
      </h3>
      <div className="flex flex-col gap-1">
        {threads.map((thread) => (
          <ThreadItem key={thread.id} thread={thread} />
        ))}
      </div>
    </div>
  );
}

function ThreadItem({ thread }: { thread: ChatThread }) {
  const path = usePathname();
  const router = useRouter();

  const isActive = path.includes(`/chat/${thread.id}`);

  function handlePrefetch() {
    router.prefetch(`/chat/${thread.id}`);
  }

  return (
    <Link
      key={thread.id}
      href={`/chat/${thread.id}`}
      onMouseEnter={handlePrefetch}
      onFocus={handlePrefetch}
    >
      <div
        className={cn(
          "flex items-center rounded-md p-2 text-sm hover:bg-sidebar",
          isActive && "bg-muted font-medium",
        )}
      >
        <div className="flex flex-col gap-0.5 overflow-hidden">
          <span className="truncate">{thread.title}</span>
        </div>
      </div>
    </Link>
  );
}
