"use client";

import { MessageCirclePlus } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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

export default function ChatThreadsSidebar() {
  const path = usePathname();
  const router = useRouter();

  const { data: threads } = api.chat.getThreads.useQuery();

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
            threads?.map((thread) => (
              <Link
                key={thread.id}
                href={`/chat/${thread.id}`}
                onMouseEnter={() => router.prefetch(`/chat/${thread.id}`)}
                onFocus={() => router.prefetch(`/chat/${thread.id}`)}
              >
                <div
                  className={cn(
                    "flex items-center rounded-md p-2 text-sm hover:bg-sidebar",
                    path.includes(`/chat/${thread.id}`) &&
                      "bg-muted font-medium",
                  )}
                >
                  <div className="flex flex-col gap-0.5 overflow-hidden">
                    <span className="truncate">{thread.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {`${thread.created_at.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })} at ${thread.created_at.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}`}
                    </span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle={true} />
    </>
  );
}
