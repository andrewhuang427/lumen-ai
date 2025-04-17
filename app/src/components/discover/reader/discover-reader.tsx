"use client";

import { ArrowLeft, Loader2, X } from "lucide-react";
import Link from "next/link";
import { api } from "../../../trpc/react";
import EmptyState from "../../empty-state";
import { Button } from "../../ui/button";
import DiscoverReaderContent from "./discover-reader-content";
import DiscoverReaderHeader from "./discover-reader-header";

type Props = {
  postId: string;
};

export default function DiscoverReader({ postId }: Props) {
  const { data: post, isLoading } = api.discover.getPost.useQuery(postId);

  if (post == null) {
    return isLoading ? (
      <div className="flex min-h-dvh items-center justify-center gap-2">
        <Loader2 className="size-4 animate-spin" />
        <div className="text-sm text-muted-foreground">Loading post...</div>
      </div>
    ) : (
      <div className="flex min-h-dvh items-center justify-center">
        <EmptyState
          title="Post not found"
          description="You may not have permission to view this post or the post may have been deleted."
          icon={<X className="size-6" />}
          action={
            <Button variant="outline" asChild>
              <Link href="/discover">
                <ArrowLeft />
                Return to Discover feed
              </Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh items-center justify-center">
      <div className="relative h-[calc(100%-2rem)] w-[calc(100%-2rem)] overflow-hidden rounded-lg border bg-sidebar">
        <div className="flex h-full flex-col items-center">
          <DiscoverReaderHeader post={post} />
          <DiscoverReaderContent post={post} />
        </div>
      </div>
    </div>
  );
}
