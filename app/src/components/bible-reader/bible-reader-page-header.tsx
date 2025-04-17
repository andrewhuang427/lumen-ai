import Header from "../header/header";
import UserFollowRequestsPopover from "../header/user-follow-requests-popover";
import UserSearchInput from "../user-search/user-search-input";
import SquareLogo from "../square-logo";
import ThemeToggle from "../theme/theme-toggle";

export function BibleReaderPageHeader() {
  return (
    <Header
      icon={<SquareLogo size={36} />}
      title="Lumen AI"
      description="The Bible reading and study app for Christians."
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
