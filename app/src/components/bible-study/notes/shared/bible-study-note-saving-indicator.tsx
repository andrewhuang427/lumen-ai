import { Loader2 } from "lucide-react";

export default function BibleStudyNoteSavingIndicator() {
  return (
    <div className="flex items-center gap-1 text-xs">
      <Loader2 className="h-3 w-3 animate-spin" />
      <span className="text-xs text-muted-foreground">Saving...</span>
    </div>
  );
}
