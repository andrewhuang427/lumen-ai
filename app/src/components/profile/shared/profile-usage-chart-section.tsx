import { Loader2 } from "lucide-react";

type Props = {
  icon: React.ReactNode;
  title: string;
  description: string;
  endActions?: React.ReactNode;
  endActionsBottom?: React.ReactNode;
  chart: React.ReactNode;
  loadingText: string;
  isLoading: boolean;
};

export default function ProfileUsageChartSection({
  icon,
  title,
  description,
  endActions,
  endActionsBottom,
  chart,
  loadingText,
  isLoading,
}: Props) {
  return (
    <div className="relative flex w-full flex-col gap-4 rounded-md border bg-muted p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            {icon}
            <div className="text-sm">{title}</div>
          </div>
          <div className="max-w-xs text-xs text-muted-foreground">
            {description}
          </div>
        </div>
        <div className="flex flex-col items-end gap-4">
          {endActions && (
            <div className="flex items-end justify-end gap-2">{endActions}</div>
          )}
          {endActionsBottom && (
            <div className="flex items-end justify-end gap-2">
              {endActionsBottom}
            </div>
          )}
        </div>
      </div>
      <div className="overflow-auto rounded-md border bg-background p-4">
        {chart}
      </div>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-background/50 text-xs text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> {loadingText}
        </div>
      )}
    </div>
  );
}
