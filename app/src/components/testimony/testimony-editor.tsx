"use client";

import "~/styles/tiptap.css";

import { EditorContent } from "@tiptap/react";
import { useTestimonyEditor } from "./context/use-testimony-editor-context";

type Props = {
  className?: string;
};

export default function TestimonyEditor({ className }: Props) {
  const editor = useTestimonyEditor();

  if (editor === null) {
    return null;
  }

  return <EditorContent editor={editor} className={className} />;
}