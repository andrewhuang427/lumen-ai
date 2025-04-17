"use client";

import { BibleStudyPostStatus } from "@prisma/client";
import { Check, CheckCircle, Loader2, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebounce } from "../../../hooks/use-debounce";
import useMediaQuery from "../../../hooks/use-media-query";
import { useIsMobile } from "../../../hooks/use-mobile";
import { cn } from "../../../lib/utils";
import { AutosizeTextarea } from "../../ui/autosize-textarea";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Separator } from "../../ui/separator";
import useBibleStudyContext from "../context/use-bible-study-context";
import BibleStudyNotesPanelCard from "../notes/bible-study-notes-panel-card";
import BibleStudyGenerateSummaryButton from "./bible-study-generate-summary-button";
import BibleStudyPostContextProvider from "./bible-study-post-context.provider";
import BibleStudyPublishButton from "./bible-study-publish-button";
import useBibleStudyPostContext from "./hooks/use-bible-study-post-context";
import useBibleStudyPostUpdate from "./hooks/use-bible-study-post-update";
import PostEditor from "./post-editor";
import PostEditorContextProvider from "./post-editor-context-provider";
import PostEditorToolbar from "./post-editor-toolbar";

type Props = {
  setIsOpen: (isOpen: boolean) => void;
};

export default function BibleStudyPublishDialogContentWrapper({
  setIsOpen,
}: Props) {
  return (
    <PostEditorContextProvider>
      <BibleStudyPostContextProvider>
        <BibleStudyPublishDialogContent setIsOpen={setIsOpen} />
      </BibleStudyPostContextProvider>
    </PostEditorContextProvider>
  );
}

function BibleStudyPublishDialogContent({ setIsOpen }: Props) {
  const { notes } = useBibleStudyContext();
  const { post, updatePostStatus, isLoadingPost } = useBibleStudyPostContext();

  const isMobile = useIsMobile();
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");

  const postEditorColumn = (
    <div className="flex grow flex-col">
      <DialogHeader className="flex w-full flex-row items-center justify-between p-6">
        <div className="flex flex-col gap-1.5">
          <DialogTitle className="flex items-center gap-2.5 text-left">
            {isMobile ? "Publish" : "Publish your Bible Study"}
            {post != null && (
              <Badge
                variant="default"
                className={cn(
                  "text-sm hover:bg-auto",
                  post.status === BibleStudyPostStatus.PUBLISHED
                    ? "bg-green-500/20 text-green-500 hover:bg-green-500/20"
                    : "bg-muted text-muted-foreground hover:bg-muted",
                )}
              >
                {post.status === BibleStudyPostStatus.PUBLISHED ? (
                  <>
                    <CheckCircle className="mr-1.5 size-3.5" /> Published
                  </>
                ) : (
                  <>
                    <Pencil className="mr-1.5 size-3.5" /> Draft
                  </>
                )}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription className="max-w-xl text-left">
            {isMobile
              ? "Share your Bible study with others."
              : "Write a post to share your Bible study with others."}
          </DialogDescription>
        </div>
        <BibleStudyGenerateSummaryButton />
      </DialogHeader>
      <PostEditorToolbar />
      <Separator />
      <div className="w-full grow overflow-y-auto p-6">
        {isLoadingPost ? (
          <div className="flex h-full items-center justify-center">
            <div className="flex items-center gap-2 text-sm">
              <Loader2 className="animate-spin" />
              Loading post...
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <PostTitleInput />
            <PostSubtitleInput />
            <PostEditor className="text-sm" />
          </div>
        )}
      </div>
      <Separator />
      <DialogFooter className="p-6">
        {updatePostStatus === "pending" && (
          <div className="mr-2 flex items-center gap-2 text-sm">
            <Loader2 className="animate-spin" size={16} />
            Saving changes...
          </div>
        )}
        {updatePostStatus === "success" && (
          <div className="mr-2 flex items-center gap-2 text-sm">
            <Check className="text-green-500" size={16} />
            Changes saved
          </div>
        )}
        <DialogClose asChild>
          <Button variant="secondary">Close</Button>
        </DialogClose>
        <BibleStudyPublishButton onSetIsOpen={setIsOpen} />
      </DialogFooter>
    </div>
  );

  const notesColumn = (
    <div className="flex w-[450px] shrink-0 flex-col gap-4 overflow-y-auto p-6">
      {notes.length === 0 && (
        <div className="flex flex-row items-center justify-center gap-2">
          <p className="text-sm text-muted-foreground">No notes found.</p>
        </div>
      )}
      {notes.map((note) => (
        <BibleStudyNotesPanelCard key={note.id} note={note} />
      ))}
    </div>
  );

  return (
    <>
      {postEditorColumn}
      <Separator orientation="vertical" />
      {isLargeScreen && notesColumn}
    </>
  );
}

function PostTitleInput() {
  const { post } = useBibleStudyPostContext();
  const [title, setTitle] = useState(post?.title ?? "");
  const debouncedTitle = useDebounce(title, 500);
  const { updatePost } = useBibleStudyPostUpdate();

  useEffect(() => {
    async function handleUpdateTitle() {
      if (post?.id == null) {
        return;
      }

      await updatePost({
        postId: post.id,
        title: debouncedTitle,
      });
    }
    void handleUpdateTitle();
  }, [post?.id, debouncedTitle, updatePost]);

  return (
    <AutosizeTextarea
      className="resize-none rounded-none border-none p-0 !text-xl font-medium !leading-normal shadow-none outline-none focus:ring-0 focus-visible:ring-0"
      placeholder="Title"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      onKeyDown={disableEnterKey}
      minHeight={24}
    />
  );
}

function PostSubtitleInput() {
  const { post } = useBibleStudyPostContext();
  const [subtitle, setSubtitle] = useState(post?.description ?? "");
  const debouncedSubtitle = useDebounce(subtitle, 500);
  const { updatePost } = useBibleStudyPostUpdate();

  useEffect(() => {
    async function handleUpdateSubtitle() {
      if (post?.id == null) {
        return;
      }

      await updatePost({
        postId: post.id,
        description: debouncedSubtitle,
      });
    }
    void handleUpdateSubtitle();
  }, [post?.id, debouncedSubtitle, updatePost]);

  return (
    <AutosizeTextarea
      className="resize-none rounded-none border-none p-0 !leading-normal text-muted-foreground shadow-none outline-none focus:ring-0 focus-visible:ring-0"
      placeholder="Add a subtitle..."
      value={subtitle}
      onChange={(e) => setSubtitle(e.target.value)}
      onKeyDown={disableEnterKey}
      minHeight={24}
    />
  );
}

function disableEnterKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
  if (e.key === "Enter") {
    e.preventDefault();
  }
}
