import {
  BookCheck,
  Glasses,
  Globe,
  History,
  Pencil,
  Search,
} from "lucide-react";
import { type AutosizeTextAreaRef } from "../ui/autosize-textarea";
import { Button } from "../ui/button";

type Props = {
  textareaRef: React.RefObject<AutosizeTextAreaRef>;
  onSetInitialMessage: (message: string) => void;
};

export default function ChatCreateThreadSuggestedPrompts({
  textareaRef,
  onSetInitialMessage,
}: Props) {
  function handleSetMessage(message: string) {
    onSetInitialMessage(message);
    textareaRef.current?.focus();
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button
        variant="outline"
        onClick={() => handleSetMessage("Find a passage about ")}
      >
        <Search className="size-4 text-blue-500" />
        <span className="grow">Find a passage</span>
      </Button>
      <Button
        variant="outline"
        onClick={() => handleSetMessage("Historical context on ")}
      >
        <History className="size-4 text-yellow-500" />
        <span className="grow">Historical context</span>
      </Button>
      <Button
        variant="outline"
        onClick={() => handleSetMessage("How to apply ")}
      >
        <Globe className="size-4 text-green-500" />
        <span className="grow">How can I apply a passage?</span>
      </Button>
      <Button
        variant="outline"
        onClick={() => handleSetMessage("Find the author of ")}
      >
        <Pencil className="size-4 text-purple-500" />
        <span className="grow">Find the author</span>
      </Button>
      <Button variant="outline" onClick={() => handleSetMessage("Summarize ")}>
        <BookCheck className="size-4 text-orange-500" />
        <span className="grow">Summarize</span>
      </Button>
      <Button
        variant="outline"
        onClick={() => handleSetMessage("Cross reference ")}
      >
        <Glasses className="size-4 text-pink-500" />
        <span className="grow">Cross reference</span>
      </Button>
    </div>
  );
}
