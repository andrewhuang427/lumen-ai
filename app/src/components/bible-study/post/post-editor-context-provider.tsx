"use client";

import Blockquote from "@tiptap/extension-blockquote";
import Placeholder from "@tiptap/extension-placeholder";
import { type Editor, type Extensions, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { createContext, type PropsWithChildren } from "react";

type PostEditorContextType = Editor | null;

export const PostEditorContext = createContext<PostEditorContextType>(null);

export const defaultExtensions: Extensions = [
  StarterKit,
  Blockquote,
  Placeholder.configure({
    placeholder: "Start writing...",
  }),
];

type Props = PropsWithChildren;

export default function PostEditorContextProvider({ children }: Props) {
  const editor = useEditor({
    extensions: defaultExtensions,
    content: "",
    immediatelyRender: false,
  });

  return (
    <PostEditorContext.Provider value={editor}>
      {children}
    </PostEditorContext.Provider>
  );
}
