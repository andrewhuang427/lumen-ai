import Header from "../header/header";
import UserFollowRequestsPopover from "../header/user-follow-requests-popover";
import UserSearchInput from "../user-search/user-search-input";

export default function DiscoverHeader() {
  return (
    <Header
      title="Discover"
      description="Uncover Bible studies created by others."
      end={
        <div className="flex items-center gap-2">
          <UserSearchInput />
          <UserFollowRequestsPopover />
        </div>
      }
    />
  );
}
