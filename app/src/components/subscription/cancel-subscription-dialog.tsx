import { useState } from "react";
import { api } from "../../trpc/react";
import { Button } from "../ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

import { UserTier } from "@prisma/client";
import { Loader2 } from "lucide-react";
import useAuth from "../auth/use-auth";
import { Dialog } from "../ui/dialog";

export default function CancelSubscriptionDialog() {
  const [isOpen, setIsOpen] = useState(false);

  const { mutateAsync: cancelSubscription, isPending } =
    api.payments.cancelSubscription.useMutation();

  const { user, setUser } = useAuth();

  async function handleCancelSubscription() {
    if (user == null) {
      return;
    }
    setIsOpen(false);
    await cancelSubscription();

    // Optimistically update the user tier
    setUser({ ...user, tier: UserTier.FREE });
  }

  if (user == null || user.tier === UserTier.FREE) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button disabled={isPending} variant="outline" className="shrink-0">
          {isPending && <Loader2 className="size-4 animate-spin" />}
          Cancel premium
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel Subscription</DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel your subscription? You will lose
            access to all of Lumen&apos;s features.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCancelSubscription}>
            Cancel Subscription
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
