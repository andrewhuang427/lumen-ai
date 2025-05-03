import { type PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  title: string;
  endContent?: React.ReactNode;
}>;

export default function ProfileSectionContainer({
  title,
  children,
  endContent,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-lg font-medium">{title}</span>
        {endContent}
      </div>
      {children}
    </div>
  );
}
