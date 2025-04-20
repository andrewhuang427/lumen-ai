import Header from "../header/header";
import UserFollowRequestsPopover from "../header/user-follow-requests-popover";
import ThemeToggle from "../theme/theme-toggle";
import UserSearchInput from "../user-search/user-search-input";

export function BibleReaderPageHeader() {
  return (
    <Header
      title="Lumen"
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
