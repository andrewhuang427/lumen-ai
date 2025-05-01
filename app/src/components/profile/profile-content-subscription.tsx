import { UserTier } from "@prisma/client";
import { Sparkles } from "lucide-react";
import useAuth from "../auth/use-auth";
import SubscriptionDialog from "../subscription/subscription-dialog";
import { Separator } from "../ui/separator";
import useProfileContext from "./use-profile-context";
import CancelSubscriptionDialog from "../subscription/cancel-subscription-dialog";

export default function ProfileContentSubscription() {
  const { userProfile } = useProfileContext();
  const { user } = useAuth();

  if (userProfile == null || user == null || user.id !== userProfile.id) {
    return null;
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="text-lg font-medium">Subscription</div>
        {user.tier === UserTier.PREMIUM ? (
          <SubscribedSection />
        ) : (
          <UnsubscribedSection />
        )}
      </div>
      <Separator />
    </>
  );
}

function SubscribedSection() {
  return (
    <div className="flex items-center gap-4">
      <div className="flex grow flex-col gap-4">
        <div className="flex">
          <div className="flex items-center gap-2 rounded-md bg-muted px-4 py-2 text-sm">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            Premium active
          </div>
        </div>
        <div className="flex max-w-sm grow text-sm text-muted-foreground">
          Your premium Lumen subscription is currently active. You can cancel
          your subscription at any time.
        </div>
      </div>
      <CancelSubscriptionDialog />
    </div>
  );
}

function UnsubscribedSection() {
  return (
    <div className="flex items-center gap-4">
      <div className="grow">
        <div className="flex max-w-sm grow text-sm text-muted-foreground">
          Upgrade to premium to unlock an improved Lumen model and premium
          features.
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-2">
        <SubscriptionDialog size="default" label="Upgrade to premium" />
      </div>
    </div>
  );
}
