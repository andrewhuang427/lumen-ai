import { type User } from "@prisma/client";
import { Settings, Sparkles } from "lucide-react";
import Link from "next/link";
import useAuth from "../auth/use-auth";
import SubscriptionDialog from "../subscription/subscription-dialog";
import { Card } from "../ui/card";

export default function AppSidebarUserTier() {
  const { user } = useAuth();

  if (user == null) {
    return null;
  }

  return (
    <Card className="flex flex-col gap-4 overflow-hidden p-4">
      {user.tier === "FREE" && (
        <>
          <div className="text-xs text-muted-foreground">
            Upgrade to premium to unlock an improved Lumen model and premium
            features.
          </div>
          <SubscriptionDialog />
        </>
      )}
      {user.tier === "PREMIUM" && (
        <>
          <div className="flex items-start justify-between gap-4">
            <div className="grow text-xs text-muted-foreground">
              You currently have access to all of Lumen&apos;s features.
            </div>
            <Link href={`/@${user.username}`}>
              <Settings className="size-4 shrink-0 text-muted-foreground transition-all duration-300 ease-in-out hover:text-secondary" />
            </Link>
          </div>
          <TierBadge tier={user.tier} />
        </>
      )}
    </Card>
  );
}

function TierBadge({ tier }: { tier: User["tier"] }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-1.5 rounded-lg bg-muted px-2.5 py-1.5 text-xs font-medium text-muted-foreground">
        {tier === "PREMIUM" && <Sparkles className="size-4 text-primary" />}
        {tier === "PREMIUM" ? "Premium" : "Free"} tier
      </div>
    </div>
  );
}
