import { cn } from "../lib/utils";

type Props = {
  title: string;
  description: string;
  icon?: React.ReactNode;
  iconClassName?: string;
  action?: React.ReactNode;
};

export default function EmptyState({
  title,
  description,
  icon,
  iconClassName,
  action,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="flex flex-col items-center justify-center gap-2">
        <div
          className={cn(
            "flex items-center gap-2 rounded-lg bg-red-500/10 p-2 text-red-500",
            iconClassName,
          )}
        >
          {icon}
        </div>
        <div className="text-lg font-medium tracking-tight">{title}</div>
        <p className="max-w-sm text-center text-sm text-muted-foreground">
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}
