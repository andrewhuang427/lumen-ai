import { CalendarDays, Loader2 } from "lucide-react";
import { useMemo } from "react";
import ActivityCalendar, { Activity } from "react-activity-calendar";
import { UserProfile } from "../../server/services/user-service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function ProfileContentUsageStatsActivityCalendar({
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
    <div className="relative flex w-full flex-col gap-4 rounded-md border bg-muted p-4">
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
      <div className="rounded-md border bg-background p-4">
        <ActivityCalendar
          data={calendarData}
          showWeekdayLabels={true}
          loading={isLoading}
        />
      </div>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-background/50 text-xs text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading activity data...
        </div>
      )}
    </div>
  );
}
