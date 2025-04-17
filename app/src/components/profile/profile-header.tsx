import Header from "../header/header";
import UserFollowRequestsPopover from "../header/user-follow-requests-popover";
import ThemeToggle from "../theme/theme-toggle";
import UserSearchInput from "../user-search/user-search-input";

export default function ProfileHeader() {
  return (
    <Header
      title="Profile"
      description="Find others to connect with."
      end={
        <div className="flex items-center gap-2">
          <UserSearchInput />
          <UserFollowRequestsPopover />
          <ThemeToggle />
        </div>
      }
    />
  );
}
