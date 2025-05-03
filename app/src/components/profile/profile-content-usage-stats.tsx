"use client";

import {
  CalendarDays,
  Flame,
  Loader2,
  Notebook,
  RefreshCcw,
} from "lucide-react";
import { useState } from "react";
import { type UserProfile } from "../../server/services/user-service";
import { api } from "../../trpc/react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import ProfileContentUsageStatsActivityCalendar from "./profile-content-usage-stats-activity-calendar";
import ProfileSectionContainer from "./shared/profile-section-container";
import useProfileContext from "./use-profile-context";

export default function ProfileContentUsageStats() {
  const { userProfile, canSeeProfile } = useProfileContext();
  if (!canSeeProfile || userProfile == null) {
    return null;
  }
  return <ProfileContentUsageStatsImpl userProfile={userProfile} />;
}

function ProfileContentUsageStatsImpl({
  userProfile,
}: {
  userProfile: UserProfile;
}) {
  const [year, setYear] = useState(new Date().getFullYear());

  const {
    data: userStreakInfo,
    refetch: refetchUserStreakInfo,
    isLoading: isLoadingStreakInfo,
    isRefetching: isRefetchingStreakInfo,
  } = api.userActivity.getUserStreakInfo.useQuery(
    { userId: userProfile?.id ?? "" },
    { enabled: userProfile != null },
  );

  const {
    data: userActivityStats,
    refetch: refetchUserActivityStats,
    isLoading: isLoadingActivityStats,
    isRefetching: isRefetchingActivityStats,
  } = api.userActivity.getActivityStats.useQuery(
    { userId: userProfile?.id ?? "" },
    { enabled: userProfile != null },
  );

  const {
    data: activityCalendarData = [],
    isLoading: isLoadingActivityCalendar,
    refetch: refetchActivityCalendarData,
    isRefetching: isRefetchingActivityCalendarData,
  } = api.userActivity.getActivityCalendar.useQuery(
    { userId: userProfile?.id ?? "", year },
    { enabled: userProfile != null },
  );

  const isLoading =
    isLoadingActivityStats ||
    isLoadingStreakInfo ||
    isLoadingActivityCalendar ||
    isRefetchingActivityStats ||
    isRefetchingStreakInfo ||
    isRefetchingActivityCalendarData;

  function handleRefreshStats() {
    void refetchUserActivityStats();
    void refetchUserStreakInfo();
    void refetchActivityCalendarData();
  }

  return (
    <>
      <ProfileSectionContainer
        title="Bible Study Stats"
        endContent={
          <Button
            variant="outline"
            onClick={handleRefreshStats}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4" />
            )}
            Refresh stats
          </Button>
        }
      >
        <div className="max-w-sm text-sm text-muted-foreground">
          Below you&apos;ll find some stats about your Bible study activity. Use
          the stats to keep yourself accountable and keep your streak going!
        </div>
        <div className="grid grid-cols-4 gap-2">
          <StatsCard
            icon={<Flame size={16} className="text-yellow-500" />}
            label="Current streak"
            value={userStreakInfo?.current_streak_days ?? 0}
            isLoading={isLoadingStreakInfo || isRefetchingStreakInfo}
          />
          <StatsCard
            icon={<Flame size={16} className="text-yellow-500" />}
            label="Longest streak"
            value={userStreakInfo?.longest_streak_days ?? 0}
            isLoading={isLoadingStreakInfo || isRefetchingStreakInfo}
          />
          <StatsCard
            icon={<CalendarDays size={16} className="text-green-500" />}
            label="Days studied"
            value={userStreakInfo?.total_study_days ?? 0}
            isLoading={isLoadingStreakInfo || isRefetchingStreakInfo}
          />
          <StatsCard
            icon={<Notebook size={16} className="text-blue-500" />}
            label="Notes created"
            value={userActivityStats?.notesCreated ?? 0}
            isLoading={isLoadingActivityStats || isRefetchingActivityStats}
          />
        </div>
        <ProfileContentUsageStatsActivityCalendar
          userProfile={userProfile}
          activityCalendarData={activityCalendarData}
          year={year}
          isLoading={
            isLoadingActivityCalendar || isRefetchingActivityCalendarData
          }
          onYearChange={setYear}
        />
      </ProfileSectionContainer>
      <Separator />
    </>
  );
}

function StatsCard({
  icon,
  label,
  value,
  isLoading,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | boolean | string;
  isLoading: boolean;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-md border bg-muted p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <div className="text-sm">{label}</div>
      </div>
      <div className="flex h-7 items-center text-xl font-medium">
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : value}
      </div>
    </div>
  );
}
