import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

export type FontSizeOption = {
  label: string;
  value: number;
};

export const DEFAULT_FONT_SIZE_OPTIONS: FontSizeOption[] = [
  { label: "Small", value: 0.04 },
  { label: "Medium", value: 0.05 },
  { label: "Large", value: 0.06 },
];

type SelectFontSizeProps = {
  fontSize: number;
  onSelect: (fontSize: number) => void;
};

export default function SelectFontSize({
  fontSize,
  onSelect,
}: SelectFontSizeProps) {
  return (
    <Select value={String(fontSize)} onValueChange={(v) => onSelect(Number(v))}>
      <SelectTrigger className="w-36">
        <SelectValue placeholder="Size" />
      </SelectTrigger>
      <SelectContent>
        {DEFAULT_FONT_SIZE_OPTIONS.map((size) => (
          <SelectItem key={size.value} value={String(size.value)}>
            {size.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
