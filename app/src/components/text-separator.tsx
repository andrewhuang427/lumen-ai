import { Label } from "./ui/label";
import { Separator } from "./ui/separator";

type Props = {
  text: string;
};

export default function TextSeparator({ text }: Props) {
  return (
    <div className="flex w-full items-center gap-2">
      <Separator className="flex-1" />
      <Label className="text-muted-foreground">{text}</Label>
      <Separator className="flex-1" />
    </div>
  );
}
