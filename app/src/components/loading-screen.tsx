import { Loader2 } from "lucide-react";

type Props = {
  label?: string;
};

export default function LoadingScreen({ label }: Props) {
  return (
    <div className="flex h-lvh w-full grow items-center justify-center">
      <Loader2 className="animate-spin" />
      {label && (
        <span className="ml-2 text-sm text-muted-foreground">{label}</span>
      )}
    </div>
  );
}
