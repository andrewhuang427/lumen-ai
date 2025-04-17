import * as React from "react";

import { cn } from "~/lib/utils";

const Header = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    showBorder?: boolean;
  }
>(({ className, showBorder = true, ...props }, ref) => (
  <header
    ref={ref}
    className={cn(
      "flex h-24 shrink-0 items-center justify-between gap-4 px-6",
      showBorder && "border-b",
      className,
    )}
    {...props}
  >
    {props.children}
  </header>
));

Header.displayName = "Header";

const HeaderLeft = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    icon?: React.ReactNode;
  }
>(({ className, icon, ...props }, ref) => {
  const component = (
    <div
      ref={ref}
      className={cn("flex grow flex-col gap-0.5 overflow-hidden", className)}
      {...props}
    />
  );

  return icon ? (
    <div className="flex grow items-center gap-4 overflow-hidden">
      <div className="flex shrink-0">{icon}</div>
      {component}
    </div>
  ) : (
    component
  );
});

HeaderLeft.displayName = "HeaderLeft";

const HeaderTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "overflow-hidden text-ellipsis whitespace-nowrap font-medium tracking-tight md:text-lg",
      className,
    )}
    {...props}
  />
));

HeaderTitle.displayName = "HeaderTitle";

const HeaderDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "overflow-hidden text-ellipsis whitespace-nowrap text-sm text-muted-foreground",
      className,
    )}
    {...props}
  />
));

HeaderDescription.displayName = "HeaderDescription";

export { Header, HeaderDescription, HeaderLeft, HeaderTitle };
