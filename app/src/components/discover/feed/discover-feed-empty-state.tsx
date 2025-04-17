import { Search, UserPlus } from "lucide-react";
import EmptyState from "../../empty-state";
import UserSearchButton from "../../user-search/user-search-button";

export default function DiscoverEmptyFeed() {
  return (
    <div className="flex h-full w-full grow flex-col items-center justify-center">
      <EmptyState
        title="No posts found"
        description="Follow others on Lumen AI to see their posts."
        icon={<UserPlus className="size-6" />}
        iconClassName="bg-muted text-primary"
        action={
          <UserSearchButton
            label={
              <>
                <Search className="size-4" />
                <span>Search for a user</span>
              </>
            }
          />
        }
      />
    </div>
  );
}
