import { Check, Loader2, X } from "lucide-react";
import { useState } from "react";
import { useToast } from "../../hooks/use-toast";
import { type FollowRequestWithUser } from "../../server/services/user-service";
import { Button } from "../ui/button";
import useUpdateFollowRequestStatus from "./use-update-follow-request-status";

type Props = {
  request: FollowRequestWithUser;
};

export default function UserFollowRequestsPopoverRequestActions({
  request,
}: Props) {
  const [pendingAction, setPendingAction] = useState<
    "accept" | "reject" | null
  >(null);

  const { updateRequest, isPending } = useUpdateFollowRequestStatus();
  const { toast } = useToast();

  async function handleAccept() {
    try {
      setPendingAction("accept");
      await updateRequest(request, "accept");
    } catch {
      toast({
        title: "Failed to accept follow request",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setPendingAction(null);
    }
  }

  async function handleReject() {
    try {
      setPendingAction("reject");
      await updateRequest(request, "reject");
    } catch {
      toast({
        title: "Failed to reject follow request",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setPendingAction(null);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant="secondary"
        disabled={isPending}
        onClick={handleAccept}
      >
        {pendingAction === "accept" ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Check size={16} className="text-green-500" />
        )}
        Accept
      </Button>
      <Button
        size="sm"
        variant="secondary"
        disabled={isPending}
        onClick={handleReject}
      >
        {pendingAction === "reject" ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <X size={16} className="text-red-500" />
        )}
        Reject
      </Button>
    </div>
  );
}
