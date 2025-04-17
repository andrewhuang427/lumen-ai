"use client";

import "../../../styles/tiptap.css";

import { EditorContent } from "@tiptap/react";
import { usePostEditor } from "./hooks/use-post-editor";

type Props = {
  className?: string;
};

export default function PostEditor({ className }: Props) {
  const editor = usePostEditor();

  if (editor === null) {
    return null;
  }

  return <EditorContent editor={editor} className={className} />;
}
