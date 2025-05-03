import { CalendarDays, Loader2, RefreshCcw } from "lucide-react";
import { useMemo, useState } from "react";
import ActivityCalendar, { type Activity } from "react-activity-calendar";
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

type Props = {
  userProfile: UserProfile;
};

export default function ProfileContentUsageStatsActivityCalendar({
  userProfile,
}: Props) {
  const [year, setYear] = useState(new Date().getFullYear());

  const {
    data: activityCalendarData = [],
    isLoading: isLoadingActivityCalendar,
    refetch: refetchActivityCalendarData,
    isRefetching: isRefetchingActivityCalendarData,
  } = api.userActivity.getActivityCalendar.useQuery(
    { userId: userProfile?.id ?? "", year },
    { enabled: userProfile != null },
  );

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

  const isLoading =
    isLoadingActivityCalendar || isRefetchingActivityCalendarData;

  function handleRefreshStats() {
    void refetchActivityCalendarData();
  }

  if (userProfile == null) {
    return null;
  }

  return (
    <ProfileUsageChartSection
      icon={<CalendarDays size={16} className="text-yellow-500" />}
      title="Bible study activity calendar"
      description="Stay consistent! Below is a calendar of your Bible study activity."
      endActions={
        <>
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
            Refresh
          </Button>
          <Select
            value={year.toString()}
            onValueChange={(value) => setYear(parseInt(value))}
          >
            <SelectTrigger className="w-24">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
            </SelectContent>
          </Select>
        </>
      }
      chart={
        <ActivityCalendar
          data={calendarData}
          showWeekdayLabels={true}
          loading={isLoading}
        />
      }
      loadingText="Loading activity data..."
      isLoading={isLoading}
    />
  );
}
