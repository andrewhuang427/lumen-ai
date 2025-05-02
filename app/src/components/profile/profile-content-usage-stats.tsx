"use client";

import {
  CalendarDays,
  Flame,
  Loader2,
  Notebook,
  RefreshCcw,
} from "lucide-react";
import { useMemo, useState } from "react";
import { type Activity, ActivityCalendar } from "react-activity-calendar";
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
import { Separator } from "../ui/separator";
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
        <div className="grid grid-cols-4 gap-2">
          <StatsCard
            icon={<Flame size={16} className="text-yellow-500" />}
            label="Current streak"
            value={userStreakInfo?.current_streak_days ?? 0}
          />
          <StatsCard
            icon={<Flame size={16} className="text-yellow-500" />}
            label="Longest streak"
            value={userStreakInfo?.longest_streak_days ?? 0}
          />
          <StatsCard
            icon={<CalendarDays size={16} className="text-green-500" />}
            label="Days studied"
            value={userStreakInfo?.total_study_days ?? 0}
          />
          <StatsCard
            icon={<Notebook size={16} className="text-blue-500" />}
            label="Notes created"
            value={userActivityStats?.notesCreated ?? 0}
          />
        </div>
        <BibleStudyActivityCalendar
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
}: {
  icon: React.ReactNode;
  label: string;
  value: number | boolean | string;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-md border bg-muted p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <div className="text-sm">{label}</div>
      </div>
      <div className="text-xl font-medium">{value}</div>
    </div>
  );
}

function BibleStudyActivityCalendar({
  userProfile,
  activityCalendarData,
  year,
  isLoading,
  onYearChange,
}: {
  userProfile: UserProfile;
  activityCalendarData: Activity[];
  year: number;
  isLoading: boolean;
  onYearChange: (year: number) => void;
}) {
  const calendarData = useMemo((): Activity[] => {
    const today = new Date();
    const endOfYear = new Date(year, 11, 31);
    const endDate = endOfYear > today ? today : endOfYear;
    const endDateStr = endDate.toISOString().split("T")[0];
    if (activityCalendarData.length === 0) {
      return [
        { date: `${year}-01-01`, count: 0, level: 0 },
        { date: endDateStr ?? "", count: 0, level: 0 },
      ];
    }
    return activityCalendarData;
  }, [activityCalendarData, year]);

  if (userProfile == null) {
    return null;
  }

  return (
    <div className="relative flex w-full flex-col gap-6 rounded-md border bg-muted p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <CalendarDays size={16} className="text-blue-500" />
          <div className="text-sm text-muted-foreground">
            Bible study activity calendar
          </div>
        </div>
        <Select
          value={year.toString()}
          onValueChange={(value) => onYearChange(parseInt(value))}
        >
          <SelectTrigger className="w-24">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2025">2025</SelectItem>
            <SelectItem value="2024">2024</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ActivityCalendar data={calendarData} showWeekdayLabels={true} />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-background/50 text-xs text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading activity data...
        </div>
      )}
    </div>
  );
}
