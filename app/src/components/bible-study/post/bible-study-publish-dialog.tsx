import { BibleStudyPostStatus } from "@prisma/client";
import { Globe, Loader2 } from "lucide-react";
import { useState } from "react";
import { api } from "../../../trpc/react";
import { Button } from "../../ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../../ui/dialog";
import useBibleStudyContext from "../context/use-bible-study-context";
import BibleStudyPublishDialogContentWrapper from "./bible-study-publish-dialog-content";
import useBibleStudyPostCreate from "./hooks/use-bible-study-post-create";

export default function BibleStudyPublishDialog() {
  const { session } = useBibleStudyContext();
  const [isOpen, setIsOpen] = useState(false);

  const { data: post, isLoading: isLoadingPost } =
    api.bibleStudyPost.getTextPost.useQuery(
      { sessionId: session?.id ?? "" },
      { enabled: session != null },
    );

  const { createPost, isPending: isCreatePostPending } =
    useBibleStudyPostCreate();

  async function handleOpen() {
    if (session == null || isLoadingPost) {
      return;
    }
    if (post == null) {
      // create empty post if no post exists
      await createPost({
        title: "",
        description: "",
        status: BibleStudyPostStatus.DRAFT,
        contentJson: {},
        contentText: "",
        sessionId: session.id,
      });
    }
    setIsOpen(true);
  }

  return (
    <Dialog open={isOpen} onOpenChange={post == null ? undefined : setIsOpen}>
      <DialogTrigger asChild onClick={handleOpen}>
        <Button
          variant="outline"
          disabled={isLoadingPost || isCreatePostPending}
        >
          {isLoadingPost || isCreatePostPending ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <Globe />
          )}
          Write a post
        </Button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="flex h-[calc(100vh-80px)] max-w-screen-lg flex-row gap-0 p-0 xl:max-w-screen-xl"
      >
        <BibleStudyPublishDialogContentWrapper setIsOpen={setIsOpen} />
      </DialogContent>
    </Dialog>
  );
}
