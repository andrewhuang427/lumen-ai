import { cn } from "../../lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  isLast?: boolean;
};

export default function InformationPageSectionList({
  children,
  className,
  isLast = false,
}: Props) {
  return (
    <ul
      className={cn("list-disc space-y-2 pl-6", !isLast && "mb-3", className)}
    >
      {children}
    </ul>
  );
}

type ListItemProps = {
  children: React.ReactNode;
  className?: string;
};

export function InformationPageSectionListItem({
  children,
  className,
}: ListItemProps) {
  return <li className={className}>{children}</li>;
}

type ListItemLabelProps = {
  children: React.ReactNode;
};

export function InformationPageSectionListItemLabel({
  children,
}: ListItemLabelProps) {
  return <span className="font-medium">{children}</span>;
}
