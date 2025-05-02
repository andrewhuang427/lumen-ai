"use client";

import { ArrowRight, Flame, Info, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "../../lib/utils";
import { api } from "../../trpc/react";
import useAuth from "../auth/use-auth";
import { Button } from "../ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { Separator } from "../ui/separator";

export default function BibleReaderHeaderActivityStats() {
  const { user } = useAuth();

  const { data: userStreakInfo, isLoading: isLoadingStreakInfo } =
    api.userActivity.getUserStreakInfo.useQuery(
      { userId: user?.id ?? "" },
      { enabled: user != null },
    );

  const currentStreakDays = userStreakInfo?.current_streak_days ?? 0;

  if (user == null) {
    return null;
  }

  return (
    <div className="flex items-center gap-2.5 overflow-x-auto rounded-full border bg-muted py-2 pl-4 pr-2 shadow">
      <StreakInfo />
      <Stat
        icon={
          <Flame
            size={16}
            className={cn(
              "shrink-0 text-muted-foreground",
              currentStreakDays > 0 ? "text-yellow-500" : "",
            )}
          />
        }
        label="Study streak"
        value={currentStreakDays}
        isLoading={isLoadingStreakInfo}
      />

      <Link href={`/@${user.username}`}>
        <Button variant="outline" size="sm" className="rounded-full">
          More stats
          <ArrowRight size={16} />
        </Button>
      </Link>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  isLoading,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  isLoading: boolean;
}) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      {icon}
      <p className="shrink-0 text-sm text-muted-foreground">{label}</p>
      <p className="flex h-7 min-w-7 items-center justify-center rounded-sm border bg-background px-1.5 py-0.5 text-sm font-medium">
        {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : value}
      </p>
    </div>
  );
}

function StreakInfo() {
  return (
    <HoverCard openDelay={0}>
      <HoverCardTrigger asChild>
        <Info size={16} className="shrink-0 text-muted-foreground" />
      </HoverCardTrigger>
      <HoverCardContent align="start" className="mt-2 flex flex-col gap-2">
        <p className="text-xs leading-normal text-muted-foreground">
          Your study streak shows the number of days in a row that you have
          studied the Bible. Your streak is increased when you create a new
          Bible study or note.
        </p>
        <Separator />
        <p className="text-xs leading-normal text-muted-foreground">
          If you miss a day, your streak will reset.
        </p>
      </HoverCardContent>
    </HoverCard>
  );
}
