import { cn } from "../../lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  isLast?: boolean;
};

export default function InformationPageSectionParagraph({
  children,
  className,
  isLast = false,
}: Props) {
  return (
    <p className={cn("text-base", !isLast && "mb-3", className)}>{children}</p>
  );
}
