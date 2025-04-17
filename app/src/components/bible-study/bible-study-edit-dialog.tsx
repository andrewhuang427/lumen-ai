"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { type EnrichedBibleStudySession } from "../../server/utils/bible-utils";
import { api } from "../../trpc/react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

type Props = {
  session: EnrichedBibleStudySession;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export default function BibleStudyEditDialog({
  session,
  trigger,
  open,
  onOpenChange,
}: Props) {
  const [isOpenInternal, setIsOpenInternal] = useState(open);
  const [title, setTitle] = useState(session.title);
  const [description, setDescription] = useState(session.description ?? "");
  const [isLoading, setIsLoading] = useState(false);

  const { mutateAsync: updateSession } =
    api.bibleStudy.updateSession.useMutation();

  const utils = api.useUtils();

  async function handleUpdateBibleStudySession() {
    try {
      setIsLoading(true);
      await updateSession({
        sessionId: session.id,
        title,
        description: description === "" ? undefined : description,
      });
      await utils.bibleStudy.getSession.invalidate({
        sessionId: session.id,
      });
      await utils.bibleStudy.getSessions.invalidate();
    } finally {
      setIsLoading(false);
      onOpenChange?.(false);
      setIsOpenInternal(false);
    }
  }

  useEffect(() => {
    setTitle(session.title);
    setDescription(session.description ?? "");
  }, [session]);

  return (
    <Dialog
      open={open ?? isOpenInternal}
      onOpenChange={(updatedOpen) => {
        onOpenChange?.(updatedOpen);
        setIsOpenInternal(updatedOpen);
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Bible Study</DialogTitle>
          <DialogDescription>
            Edit the title and description of your bible study.
          </DialogDescription>
        </DialogHeader>
        <div className="my-4 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium">Title</Label>
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium">Description</Label>
            <Textarea
              placeholder="Description"
              value={description ?? ""}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-24"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleUpdateBibleStudySession} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
