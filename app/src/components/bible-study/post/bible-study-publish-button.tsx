import { BibleStudyPostStatus } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "../../../hooks/use-toast";
import { Button } from "../../ui/button";
import { ToastAction } from "../../ui/toast";
import useBibleStudyPostContext from "./hooks/use-bible-study-post-context";
import useBibleStudyPostUpdate from "./hooks/use-bible-study-post-update";

type Props = {
  onSetIsOpen: (open: boolean) => void;
};

export default function BibleStudyPublishButton({ onSetIsOpen }: Props) {
  const { post } = useBibleStudyPostContext();
  const { updatePost, status } = useBibleStudyPostUpdate();
  const router = useRouter();

  async function handlePublish() {
    if (post == null) {
      return;
    }
    const updatedPost = await updatePost({
      postId: post.id,
      status:
        post.status === BibleStudyPostStatus.PUBLISHED
          ? BibleStudyPostStatus.DRAFT
          : BibleStudyPostStatus.PUBLISHED,
    });
    onSetIsOpen(true);

    if (updatedPost.status === BibleStudyPostStatus.PUBLISHED) {
      toast({
        title: "Post published",
        description: "Your have successfully published your post",
        action: (
          <ToastAction
            altText="View post"
            onClick={() => router.push(`/discover/${post.id}`)}
          >
            View post
          </ToastAction>
        ),
      });
    }
  }

  return (
    <Button disabled={post == null} onClick={handlePublish}>
      {status === "pending" && <Loader2 className="animate-spin" size={16} />}
      {post?.status === BibleStudyPostStatus.PUBLISHED
        ? "Unpublish"
        : "Publish"}
    </Button>
  );
}
