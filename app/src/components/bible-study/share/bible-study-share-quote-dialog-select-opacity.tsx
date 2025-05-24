import { Slider } from "../../ui/slider";
import { DEFAULT_OVERLAY_OPACITY } from "./bible-study-share-quote-dialog";

type SelectOpacityProps = {
  opacity: number;
  onSelect: (opacity: number) => void;
};

export default function SelectOpacity({
  opacity,
  onSelect,
}: SelectOpacityProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="whitespace-nowrap text-xs text-muted-foreground">
        Background Opacity
      </span>
      <Slider
        min={0}
        max={1}
        step={0.01}
        value={[opacity]}
        onValueChange={([v]) => onSelect(v ?? DEFAULT_OVERLAY_OPACITY)}
        className="w-32"
      />
    </div>
  );
}
