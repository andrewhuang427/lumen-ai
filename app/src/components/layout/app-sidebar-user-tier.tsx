import { User } from "@prisma/client";
import { Sparkles } from "lucide-react";
import useAuth from "../auth/use-auth";
import SubscriptionDialog from "../subscription/subscription-dialog";
import { Card } from "../ui/card";

export default function AppSidebarUserTier() {
  const { user } = useAuth();

  if (user == null) {
    return null;
  }

  return (
    <Card className="flex flex-col gap-2.5 overflow-hidden p-2.5">
      {user.tier === "FREE" ? (
        <>
          <div className="text-sm text-muted-foreground">
            Limited access to features
          </div>
          <div className="flex">
            <TierBadge tier={user.tier} />
          </div>
          <SubscriptionDialog />
        </>
      ) : (
        <>
          <div className="text-sm text-muted-foreground">
            Unlimited access to all features
          </div>
          <div className="flex">
            <TierBadge tier={user.tier} />
          </div>
        </>
      )}
    </Card>
  );
}

function TierBadge({ tier }: { tier: User["tier"] }) {
  return (
    <div className="flex items-center gap-1.5 rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
      {tier === "PREMIUM" && <Sparkles className="size-4 text-primary" />}
      {tier === "PREMIUM" ? "Premium" : "Free"} tier
    </div>
  );
}
