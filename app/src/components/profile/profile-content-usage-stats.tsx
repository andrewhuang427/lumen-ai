import {
  CalendarDays,
  Flame,
  Loader2,
  Notebook,
  RefreshCcw,
} from "lucide-react";
import { api } from "../../trpc/react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import ProfileSectionContainer from "./shared/profile-section-container";
import useProfileContext from "./use-profile-context";

export default function ProfileContentUsageStats() {
  const { userProfile, canSeeProfile } = useProfileContext();

  if (!canSeeProfile || userProfile == null) {
    return null;
  }

  return <ProfileContentUsageStatsImpl />;
}

function ProfileContentUsageStatsImpl() {
  const { userProfile } = useProfileContext();

  const {
    data: userActivityStats,
    refetch: refetchUserActivityStats,
    isLoading,
    isRefetching,
  } = api.userActivity.getUserStreakInfo.useQuery(
    { userId: userProfile?.id ?? "" },
    { enabled: userProfile != null },
  );

  return (
    <>
      <ProfileSectionContainer
        title="Bible Study Stats"
        endContent={
          <Button
            variant="outline"
            onClick={() => refetchUserActivityStats()}
            disabled={isLoading}
          >
            {isLoading || isRefetching ? (
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
            value={userActivityStats?.current_streak_days ?? 0}
          />
          <StatsCard
            icon={<Flame size={16} className="text-yellow-500" />}
            label="Longest streak"
            value={userActivityStats?.longest_streak_days ?? 0}
          />
          <StatsCard
            icon={<CalendarDays size={16} className="text-green-500" />}
            label="Days studied"
            value={userActivityStats?.total_study_days ?? 0}
          />
          <StatsCard
            icon={<Notebook size={16} className="text-blue-500" />}
            label="Notes created"
            value={userActivityStats?.has_studied_today ? 1 : 0}
          />
        </div>
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
  value: number | boolean;
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
