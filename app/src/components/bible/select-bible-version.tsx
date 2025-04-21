"use client";

import { type BibleVersion } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";
import { api } from "../../trpc/react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

type Props = {
  selectedVersion: BibleVersion | null;
  onVersionChange: (version: BibleVersion) => void;
  className?: string;
};

export default function SelectBibleVersion({
  selectedVersion,
  onVersionChange,
  className,
}: Props) {
  const { data: versions = [], isLoading } = api.bible.getVersions.useQuery();

  function handleVersionChange(value: string) {
    const version = versions.find((version) => version.id === value);
    if (version != null) {
      onVersionChange(version);
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <Select
              value={selectedVersion?.id}
              onValueChange={handleVersionChange}
              disabled={versions.length <= 1}
            >
              <SelectTrigger
                aria-label="Select a version"
                className={cn("shrink-0", className)}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {selectedVersion?.abbreviation ?? "Version"}
              </SelectTrigger>
              <SelectContent className="overflow-y-auto max-md:max-h-64">
                {versions.map((version) => (
                  <SelectItem key={version.id} value={version.id}>
                    {version.abbreviation} - {version.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>More Bible versions coming soon</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
