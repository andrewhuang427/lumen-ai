"use client";

import "../../../styles/tiptap.css";

import { EditorContent, type JSONContent, useEditor } from "@tiptap/react";
import Link from "next/link";
import { useEffect } from "react";
import { type EnrichedBibleStudyPost } from "../../../server/services/discover-feed-service";
import { defaultExtensions } from "../../bible-study/post/post-editor-context-provider";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Separator } from "../../ui/separator";
import { getPostChapterRange } from "./discover-reader-utils";

type Props = {
  post: EnrichedBibleStudyPost;
};

export default function DiscoverReaderContent({ post }: Props) {
  const editor = useEditor({
    content: (post?.content_json ?? {}) as JSONContent,
    extensions: defaultExtensions,
    editable: false,
  });

  useEffect(() => {
    if (editor && post?.content_json) {
      editor.commands.setContent(post.content_json as JSONContent);
    }
  }, [post?.content_json, editor]);

  return (
    <div className="flex w-full grow flex-col overflow-y-auto p-4 py-8 md:p-12">
      <div className="mx-auto w-full max-w-2xl">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="rounded-md bg-muted px-2 py-1 text-sm font-medium text-muted-foreground">
              {getPostChapterRange(post)}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-medium tracking-tight">
              {post.title}
            </h1>
            <div className="text-sm text-muted-foreground">
              {post.description}
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Avatar className="size-8">
              <AvatarImage src={post.user.avatar_url ?? undefined} />
              <AvatarFallback>{post.user.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-0.5">
              <div className="text-sm text-muted-foreground">
                Written by{" "}
                <Link
                  href={`/@${post.user.username}`}
                  className="font-medium text-foreground hover:underline"
                >
                  {post.user.name}
                </Link>
              </div>
              <div className="text-xs text-muted-foreground">
                {post.created_at.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>
        </div>
        <Separator className="my-8" />
        <EditorContent editor={editor} className="w-full" />
      </div>
    </div>
  );
}
