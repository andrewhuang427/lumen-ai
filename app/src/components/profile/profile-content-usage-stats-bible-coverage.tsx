"use client";

import { BookOpen, Expand, Loader2, RefreshCcw, Shrink } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import { type UserProfile } from "../../server/services/user-service";
import { api } from "../../trpc/react";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import ProfileUsageChartSection from "./shared/profile-usage-chart-section";

export default function ProfileContentUsageStatsBibleCoverage({
  userProfile,
}: {
  userProfile: UserProfile;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [versionId, setVersionId] = useState("");
  const { data: versions } = api.bible.getVersions.useQuery();

  const {
    data: bibleCoverage,
    isLoading: isLoadingBibleCoverage,
    refetch: refetchBibleCoverage,
    isRefetching: isRefetchingBibleCoverage,
  } = api.userActivity.getBibleCoverage.useQuery({
    versionId,
    userId: userProfile.id,
  });

  useEffect(() => {
    if (versionId === "" && versions?.[0]) {
      setVersionId(versions[0].id);
    }
  }, [versions, versionId]);

  const isLoading = isLoadingBibleCoverage || isRefetchingBibleCoverage;

  function handleRefreshStats() {
    void refetchBibleCoverage();
  }

  return (
    <ProfileUsageChartSection
      icon={<BookOpen size={16} className="text-yellow-500" />}
      title="Bible study coverage"
      description="The chart below displays which books and chapters of the Bible you have covered through Bible study."
      endActions={
        <>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <Shrink size={16} /> : <Expand size={16} />}
          </Button>
          <Button
            variant="outline"
            onClick={handleRefreshStats}
            disabled={isLoading}
          >
            {isRefetchingBibleCoverage ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4" />
            )}
            Refresh
          </Button>
          <Select
            value={versionId}
            disabled={isLoading || versions == null || versions.length <= 1}
            onValueChange={(value) => setVersionId(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a version" />
            </SelectTrigger>
            <SelectContent>
              {versions?.map((version) => (
                <SelectItem key={version.id} value={version.id}>
                  {version.abbreviation}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </>
      }
      endActionsBottom={<BibleCoverageLegend />}
      chart={
        <>
          <div className={cn("flex flex-col gap-1", !isExpanded && "h-96")}>
            {bibleCoverage?.map((book, bookIndex) => (
              <div key={bookIndex} className="flex items-center gap-2">
                <div className="flex items-center gap-4">
                  <div className="w-28 text-end text-xs">{book.name}</div>
                  <BookCoverageRow coverage={book.coverage} />
                </div>
              </div>
            ))}
            {/* Spacer */}
            <div className="h-2 shrink-0" />
          </div>
        </>
      }
      loadingText="Loading Bible coverage..."
      isLoading={isLoading}
    />
  );
}

function BookCoverageRow({ coverage }: { coverage: boolean[] }) {
  return (
    <div className="flex shrink-0 items-center gap-1 text-xs">
      {coverage.map((covered, index) => (
        <CoverageSquare key={index} covered={covered} label={`${index + 1}`} />
      ))}
    </div>
  );
}

function CoverageSquare({
  covered,
  label,
}: {
  covered: boolean;
  label: string;
}) {
  return (
    <div
      className={cn(
        "flex h-4 w-4 shrink-0 items-center justify-center rounded-[2px] border-muted-foreground/50 bg-secondary-foreground",
        covered
          ? "bg-primary text-background"
          : "bg-secondary-foreground text-secondary/50 dark:text-secondary/20",
      )}
    >
      <span className="text-[8px]">{label}</span>
    </div>
  );
}

function BibleCoverageLegend() {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <CoverageSquare covered={true} label="" />
        <div className="text-xs">Covered</div>
      </div>
      <div className="flex items-center gap-2">
        <CoverageSquare covered={false} label="" />
        <div className="text-xs">Not covered</div>
      </div>
    </div>
  );
}
