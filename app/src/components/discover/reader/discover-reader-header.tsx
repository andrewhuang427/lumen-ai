"use client";

import { ArrowRight, Notebook, X } from "lucide-react";
import Link from "next/link";
import { useIsMobile } from "../../../hooks/use-mobile";
import { type EnrichedBibleStudyPost } from "../../../server/services/discover-feed-service";
import useAuth from "../../auth/use-auth";
import { Button } from "../../ui/button";
import { Separator } from "../../ui/separator";
import DiscoverPostLikeButton from "../discover-post-like-button";
import DiscoverReaderHeaderBibleTextPopover from "./discover-reader-header-bible-text-popover";
import DiscoverReaderHeaderPaginateButtons from "./discover-reader-header-paginate-buttons";

type Props = {
  post: EnrichedBibleStudyPost;
};

export default function DiscoverReaderHeader({ post }: Props) {
  const { user } = useAuth();
  const isMobile = useIsMobile();

  return (
    <div className="flex w-full items-center gap-4 border-b p-4">
      <Link href="/discover">
        <Button size="icon" variant="outline">
          <X />
        </Button>
      </Link>
      {!isMobile && (
        <>
          <Separator orientation="vertical" />
          <DiscoverReaderHeaderPaginateButtons post={post} />
        </>
      )}
      <div className="flex-1" />
      <DiscoverPostLikeButton post={post} />
      {!isMobile && (
        <>
          <Separator orientation="vertical" />
          <DiscoverReaderHeaderBibleTextPopover post={post} />
        </>
      )}
      {user?.id === post.user_id && !isMobile && (
        <>
          <Separator orientation="vertical" />
          <Link href={`/study/${post.session_id}`}>
            <Button variant="outline">
              <Notebook />
              Open Bible study
              <ArrowRight />
            </Button>
          </Link>
        </>
      )}
    </div>
  );
}
