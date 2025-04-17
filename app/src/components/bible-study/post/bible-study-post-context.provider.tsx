"use client";

import { type BibleStudyPost } from "@prisma/client";
import { type MutationStatus } from "@tanstack/react-query";
import { createContext, useMemo, type PropsWithChildren } from "react";
import { api } from "../../../trpc/react";
import useBibleStudyContext from "../context/use-bible-study-context";
import useBibleStudyPostInitEditor from "./hooks/use-bible-study-post-init-editor";
import useBibleStudyPostSaveContentOnUpdate from "./hooks/use-bible-study-post-save-content-on-update";

export type BibleStudyPostContextType = {
  post: BibleStudyPost | null;
  isLoadingPost: boolean;
  updatePostStatus: MutationStatus;
};

export const BibleStudyPostContext = createContext<BibleStudyPostContextType>({
  post: null,
  isLoadingPost: false,
  updatePostStatus: "idle",
});

type Props = PropsWithChildren;

export default function BibleStudyPostContextProvider({ children }: Props) {
  const { session } = useBibleStudyContext();

  const { data: post, isLoading: isLoadingPost } =
    api.bibleStudyPost.getPost.useQuery(
      { sessionId: session?.id ?? "" },
      { enabled: session != null },
    );

  useBibleStudyPostInitEditor(post);

  const updatePostStatus = useBibleStudyPostSaveContentOnUpdate(post);

  const contextValue: BibleStudyPostContextType = useMemo(() => {
    return {
      post: post ?? null,
      isLoadingPost,
      updatePostStatus,
    };
  }, [post, isLoadingPost, updatePostStatus]);

  return (
    <BibleStudyPostContext.Provider value={contextValue}>
      {children}
    </BibleStudyPostContext.Provider>
  );
}
