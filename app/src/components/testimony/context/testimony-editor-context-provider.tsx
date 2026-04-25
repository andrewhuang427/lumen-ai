"use client";

import Blockquote from "@tiptap/extension-blockquote";
import Placeholder from "@tiptap/extension-placeholder";
import { type Editor, type Extensions, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { createContext, type PropsWithChildren } from "react";

type TestimonyEditorContextType = Editor | null;

export const TestimonyEditorContext =
  createContext<TestimonyEditorContextType>(null);

export const defaultExtensions: Extensions = [
  StarterKit,
  Blockquote,
  Placeholder.configure({
    placeholder: "Write your testimony here...",
  }),
];

type Props = PropsWithChildren;

export default function TestimonyEditorContextProvider({ children }: Props) {
  const editor = useEditor({
    extensions: defaultExtensions,
    content: "",
    immediatelyRender: false,
  });

  return (
    <TestimonyEditorContext.Provider value={editor}>
      {children}
    </TestimonyEditorContext.Provider>
  );
}