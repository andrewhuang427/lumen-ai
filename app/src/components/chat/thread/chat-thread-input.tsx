import { Loader2, Send } from "lucide-react";
import { useState } from "react";
import { ModelSelector } from "../../model/model-selector";
import { AutosizeTextarea } from "../../ui/autosize-textarea";
import { Button } from "../../ui/button";
import { useChatThreadContext } from "./use-chat-thread-context";

export default function ChatThreadInput() {
  const [value, setValue] = useState("");
  const { isSendingMessage, onSendMessage } = useChatThreadContext();

  async function handleSendMessage() {
    setValue("");
    await onSendMessage(value);
  }

  return (
    <>
      <AutosizeTextarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            void handleSendMessage();
          }
        }}
        placeholder="Ask Lumen AI anything about the Bible..."
        className="!max-h-48 w-full resize-none overflow-y-auto border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      <div className="flex items-end gap-2">
        <ModelSelector />
        {/* <WebSearchToggle /> */}
        <div className="grow" />
        <Button
          size="icon"
          variant="outline"
          disabled={isSendingMessage}
          onClick={handleSendMessage}
        >
          {isSendingMessage ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Send className="size-4" />
          )}
        </Button>
      </div>
    </>
  );
}
