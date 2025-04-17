"use client";

import { Loader2, Send } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import { useRef, useState } from "react";
import { cn } from "~/lib/utils";
import { api } from "../../trpc/react";
import { ModelSelector } from "../model/model-selector";
import {
  AutosizeTextarea,
  type AutosizeTextAreaRef,
} from "../ui/autosize-textarea";
import { Button } from "../ui/button";
import ChatCreateThreadSuggestedPrompts from "./chat-create-thread-suggested-prompts";

export default function ChatCreateThreadInput() {
  const [initialMessage, setInitialMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const textareaRef = useRef<AutosizeTextAreaRef>(null);
  const router = useRouter();

  const { mutateAsync: createThread } = api.chat.createThread.useMutation();
  const utils = api.useUtils();

  async function handleCreateThread() {
    setIsLoading(true);
    try {
      const thread = await createThread({ initialMessage });
      utils.chat.getThreads.setData(undefined, (previousThreads) => [
        thread,
        ...(previousThreads ?? []),
      ]);
      router.push(`/chat/${thread.id}`);
    } catch {
      // reset the loading state only when there is an error as the
      // redirection
      setIsLoading(false);
    }
  }

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="flex w-full max-w-3xl flex-col gap-4 p-4">
        <div className="mb-4 flex flex-col items-center gap-2 text-center">
          <h2 className="text-2xl font-medium tracking-tight">
            What can Lumen AI help you with?
          </h2>
          <p className="text-center text-sm text-muted-foreground">
            Lumen AI is your AI companion for studying and understanding
            scripture.
          </p>
        </div>
        <div
          className={cn(
            "relative flex w-full flex-col gap-2 rounded-lg border bg-sidebar p-2",
            isLoading && "shine-border shine-border-active",
          )}
        >
          <AutosizeTextarea
            ref={textareaRef}
            value={initialMessage}
            onChange={(e) => setInitialMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void handleCreateThread();
              }
            }}
            className="!max-h-48 w-full resize-none overflow-y-auto border-none bg-transparent outline-none focus:ring-0 focus-visible:ring-0"
            placeholder="Ask Lumen AI anything about the Bible..."
          />
          <div className="flex w-full items-end gap-2">
            <ModelSelector />
            {/* <WebSearchToggle /> */}
            <div className="grow" />
            <Button
              variant="outline"
              size="icon"
              onClick={handleCreateThread}
              disabled={isLoading || initialMessage.length === 0}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        <ChatCreateThreadSuggestedPrompts
          textareaRef={textareaRef}
          onSetInitialMessage={setInitialMessage}
        />
        <div className="flex items-center justify-center text-center">
          <p className="max-w-lg text-xs text-muted-foreground">
            Compare responses with scripture and trusted sources.
          </p>
        </div>
      </div>
    </div>
  );
}
