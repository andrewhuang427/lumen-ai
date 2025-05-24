import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

export const DEFAULT_FONT_OPTIONS = [
  { label: "Arial", value: "Arial" },
  { label: "Georgia", value: "Georgia" },
  { label: "Times New Roman", value: "Times New Roman" },
  { label: "Courier New", value: "Courier New" },
  { label: "Verdana", value: "Verdana" },
  { label: "Trebuchet MS", value: "Trebuchet MS" },
  { label: "Comic Sans MS", value: "Comic Sans MS" },
  { label: "Impact", value: "Impact" },
  { label: "Garamond", value: "Garamond" },
  { label: "Palatino", value: "Palatino" },
  { label: "Tahoma", value: "Tahoma" },
  { label: "Lucida Console", value: "Lucida Console" },
  { label: "Brush Script MT", value: "Brush Script MT" },
];

type SelectFontProps = {
  font: string;
  onSelect: (font: string) => void;
};

export default function SelectFont({ font, onSelect }: SelectFontProps) {
  return (
    <Select value={font} onValueChange={onSelect}>
      <SelectTrigger className="w-36">
        <SelectValue placeholder="Font" style={{ fontFamily: font }} />
      </SelectTrigger>
      <SelectContent>
        {DEFAULT_FONT_OPTIONS.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            style={{ fontFamily: option.value }}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
