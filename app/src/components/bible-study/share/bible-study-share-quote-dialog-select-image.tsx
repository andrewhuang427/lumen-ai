import { Upload } from "lucide-react";
import NextImage, { type StaticImageData } from "next/image";
import React, { useRef } from "react";
import { bigSur, field, forest, solitude } from "../../../assets";
import { Button } from "../../ui/button";

export type ImageOption = {
  label: string;
  path: StaticImageData;
};

export const DEFAULT_IMAGE_OPTIONS: ImageOption[] = [
  { label: "Big Sur", path: bigSur },
  { label: "Field", path: field },
  { label: "Forest", path: forest },
  { label: "Solitude", path: solitude },
];

type SelectImageProps = {
  onSelect: (src: string) => void;
};

export default function SelectImage({ onSelect }: SelectImageProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleUploadClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const source = event.target?.result as string;
      if (source) {
        onSelect(source);
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="flex items-center gap-2">
      {DEFAULT_IMAGE_OPTIONS.map((option: ImageOption) => (
        <NextImage
          key={option.label}
          src={option.path}
          alt={option.label}
          className="h-9 w-9 shrink-0 cursor-pointer rounded border object-cover transition-opacity duration-200 hover:border-primary hover:opacity-80"
          onClick={() => onSelect(option.path.src)}
        />
      ))}
      <Button
        variant="outline"
        size="icon"
        className="shrink-0"
        onClick={handleUploadClick}
      >
        <Upload />
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
}
