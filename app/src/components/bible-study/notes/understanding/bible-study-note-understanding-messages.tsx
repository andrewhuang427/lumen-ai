import { Church, User } from "lucide-react";
import { cn } from "../../../../lib/utils";
import { type TypedBibleStudyNoteUnderstand } from "../../../../server/utils/bible-note-utils";

type Props = {
  messages: TypedBibleStudyNoteUnderstand["data"]["messages"];
};

export default function BibleStudyNoteUnderstandingMessages({
  messages,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      {messages.map((m, index) => (
        <div
          key={index}
          className={cn(
            "flex flex-col gap-2 text-xs",
            m.role === "user"
              ? "items-end text-right"
              : "items-start text-left",
          )}
        >
          <div
            className={cn(
              "flex items-center gap-2 rounded-md px-2 py-1 font-medium",
              m.role === "user"
                ? "bg-blue-500/10 text-blue-500"
                : "bg-yellow-500/10 text-yellow-500",
            )}
          >
            {m.role === "user" ? (
              <>
                <User size={12} className="text-blue-500" />
                <span>You</span>
              </>
            ) : (
              <>
                <Church size={12} className="text-yellow-500" />
                <span>Lumen</span>
              </>
            )}
          </div>
          <div
            className={cn(
              "whitespace-pre-wrap text-xs",
              m.role === "user"
                ? "text-right text-muted-foreground"
                : "text-left",
            )}
          >
            {m.content}
          </div>
        </div>
      ))}
    </div>
  );
}
