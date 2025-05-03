"use client";

import { type UserProfile } from "../../server/services/user-service";
import { Separator } from "../ui/separator";
import ProfileContentUsageStatsActivityCalendar from "./profile-content-usage-stats-activity-calendar";
import ProfileContentUsageStatsBibleCoverage from "./profile-content-usage-stats-bible-coverage";
import ProfileContentUsageStatsStreakStats from "./profile-content-usage-stats-streak-stats";
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
  return (
    <>
      <ProfileSectionContainer title="Bible Study Stats">
        <ProfileContentUsageStatsStreakStats userProfile={userProfile} />
        <ProfileContentUsageStatsActivityCalendar userProfile={userProfile} />
        <ProfileContentUsageStatsBibleCoverage userProfile={userProfile} />
      </ProfileSectionContainer>
      <Separator />
    </>
  );
}
