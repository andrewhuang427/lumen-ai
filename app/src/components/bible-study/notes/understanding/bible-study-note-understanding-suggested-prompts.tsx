import { ArrowUpRight, CircleHelp } from "lucide-react";
import { Badge } from "../../../ui/badge";
import { SUGGESTED_PROMPTS } from "../shared/bible-study-notes-utils";

type Props = {
  onSelectPrompt: (prompt: string) => void;
};

export default function BibleStudyNoteUnderstandingSuggestedPrompts({
  onSelectPrompt,
}: Props) {
  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="flex items-center gap-1">
        <CircleHelp size={16} className="text-muted-foreground" />
        <p className="text-xs font-medium text-muted-foreground">
          Common questions
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {SUGGESTED_PROMPTS.map((prompt, index) => (
          <Badge
            key={index}
            variant="outline"
            className="shrink-0 cursor-pointer hover:bg-muted"
            onClick={() => onSelectPrompt(prompt)}
          >
            {prompt}
            <ArrowUpRight size={12} className="ml-1" />
          </Badge>
        ))}
      </div>
    </div>
  );
}
