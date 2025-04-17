import { Loader2 } from "lucide-react";

import { Send } from "lucide-react";
import { useState } from "react";
import { type TypedBibleStudyNoteUnderstand } from "../../../../server/utils/bible-note-utils";
import { AutosizeTextarea } from "../../../ui/autosize-textarea";
import { Button } from "../../../ui/button";
import { Separator } from "../../../ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../../ui/tooltip";
import BibleStudyNoteUnderstandingSuggestedPrompts from "./bible-study-note-understanding-suggested-prompts";
import { ModelSelector } from "../../../model/model-selector";

type Props = {
  note: TypedBibleStudyNoteUnderstand;
  isSending: boolean;
  onSendMessage: (message: string) => Promise<void>;
};

export default function BibleStudyNoteUnderstandingTextarea({
  note,
  isSending,
  onSendMessage,
}: Props) {
  const [message, setMessage] = useState("");
  const isVersesEmpty = note.data.verses.length === 0;

  async function handleSendMessage() {
    if (isVersesEmpty) {
      return;
    }
    setMessage("");
    await onSendMessage(message);
  }

  return (
    <div className="flex flex-col rounded-md border bg-background">
      <div className="flex flex-col gap-2 p-4">
        <AutosizeTextarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void handleSendMessage();
            }
          }}
          placeholder="Ask a question..."
          className="min-h-24 resize-none border-none p-1 focus-visible:ring-0"
        />
        <div className="flex items-end gap-2">
          <ModelSelector />
          <div className="grow" />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                className="h-8 w-8 rounded"
                onClick={handleSendMessage}
                disabled={isSending || isVersesEmpty || message.length === 0}
              >
                {isSending ? <Loader2 className="animate-spin" /> : <Send />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isVersesEmpty ? <p>Add verses</p> : <p>Send message</p>}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      <Separator />
      <BibleStudyNoteUnderstandingSuggestedPrompts
        onSelectPrompt={(prompt) => setMessage(prompt)}
      />
    </div>
  );
}
