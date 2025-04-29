import * as React from "react";
import { cn } from "~/lib/utils";

const ChatThreadContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex h-full w-full flex-col overflow-hidden", className)}
    {...props}
  >
    {children}
  </div>
));

ChatThreadContainer.displayName = "ChatThreadContainer";

const ChatThreadHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "sticky top-0 z-10 flex h-20 items-center border-b p-6 font-medium",
      className,
    )}
    {...props}
  >
    <div className="flex grow items-center gap-2">{children}</div>
  </div>
));

ChatThreadHeader.displayName = "ChatThreadHeader";

const ChatThreadContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex w-full flex-1 overflow-x-hidden overflow-y-scroll pt-6",
      className,
    )}
    {...props}
  >
    {children}
  </div>
));

ChatThreadContent.displayName = "ChatThreadContent";

const ChatThreadCenterContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative mx-auto flex h-full max-w-3xl flex-1 flex-col",
      className,
    )}
    {...props}
  >
    {children}
  </div>
));

ChatThreadCenterContainer.displayName = "ChatThreadCenterContainer";

const ChatThreadMessagesContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "mx-auto flex w-full max-w-3xl flex-1 flex-col gap-3 px-4 pt-6",
      className,
    )}
    {...props}
  >
    {children}
  </div>
));

ChatThreadMessagesContainer.displayName = "ChatThreadMessagesContainer";

const ChatThreadMessage = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col rounded-lg bg-sidebar p-4 text-sm", className)}
    {...props}
  >
    {children}
  </div>
));

ChatThreadMessage.displayName = "ChatThreadMessage";

const ChatThreadInputContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & { isSendingMessage?: boolean }
>(({ className, children, isSendingMessage, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "sticky bottom-0 z-10 mx-auto w-full bg-background",
      className,
    )}
    {...props}
  >
    <div
      className={cn(
        "relative flex flex-col gap-2 rounded-lg border bg-sidebar p-2",
        isSendingMessage && "shine-border shine-border-active",
      )}
    >
      {children}
    </div>
    <p className="my-2 text-center text-xs text-muted-foreground">
      Compare responses with scripture and trusted sources.
    </p>
  </div>
));

ChatThreadInputContainer.displayName = "ChatThreadInputContainer";

export {
  ChatThreadCenterContainer,
  ChatThreadContainer,
  ChatThreadContent,
  ChatThreadHeader,
  ChatThreadInputContainer,
  ChatThreadMessage,
  ChatThreadMessagesContainer,
};
