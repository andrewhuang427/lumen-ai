import { type PropsWithChildren } from "react";
import { cn } from "../../../lib/utils";

function DiscoverFeedCardContainer({
  children,
  border,
  onClick,
}: PropsWithChildren<{
  border?: boolean;
  onClick?: () => void;
}>) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 p-6",
        border && "border-t",
        onClick && "cursor-pointer",
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

function DiscoverFeedCardHeader({ children }: PropsWithChildren) {
  return <div className="flex flex-col gap-2">{children}</div>;
}

function DiscoverFeedCardTitle({ children }: PropsWithChildren) {
  return (
    <div className="grow text-lg font-medium tracking-tight">{children}</div>
  );
}

function DiscoverFeedCardDescription({ children }: PropsWithChildren) {
  return <p className="text-sm text-muted-foreground">{children}</p>;
}

function DiscoverFeedCardChip({ children }: PropsWithChildren) {
  return (
    <div className="shrink-0 rounded-lg bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
      {children}
    </div>
  );
}

function DiscoverFeedCardFooter({
  children,
  className,
}: PropsWithChildren<{
  className?: string;
}>) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      {children}
    </div>
  );
}

export {
  DiscoverFeedCardChip,
  DiscoverFeedCardContainer,
  DiscoverFeedCardDescription,
  DiscoverFeedCardFooter,
  DiscoverFeedCardHeader,
  DiscoverFeedCardTitle,
};
