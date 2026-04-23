"use client";

import { type Testimony } from "@prisma/client";
import { useEffect } from "react";
import Header from "~/components/header/header";
import TestimonyEditorContextProvider from "~/components/testimony/context/testimony-editor-context-provider";
import { useTestimonyEditor } from "~/components/testimony/context/use-testimony-editor-context";
import useTestimonyAutoSave from "~/components/testimony/hooks/use-testimony-auto-save";
import TestimonyEditor from "~/components/testimony/testimony-editor";
import TestimonyEditorToolbar from "~/components/testimony/toolbar/testimony-editor-toolbar";

function TestimonyEditorView({ testimony }: { testimony: Testimony }) {
  const editor = useTestimonyEditor();
  const saveStatus = useTestimonyAutoSave(testimony);

  const title = testimony.title;

  // Initialize editor content when testimony loads
  useEffect(() => {
    if (editor && testimony.content_json) {
      editor.commands.setContent(testimony.content_json as object);
    }
  }, [editor, testimony.content_json]);

  const saveLabel =
    saveStatus === "pending"
      ? "Saving..."
      : saveStatus === "success"
        ? "Saved"
        : "";

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <Header
        title={title}
        description="A personal account of how you came to know Christ"
        end={
          saveLabel && (
            <span className="pr-4 text-xs text-muted-foreground">
              {saveLabel}
            </span>
          )
        }
      />
      <div className="pt-2" />
      <TestimonyEditorToolbar />
      <div className="flex-1 overflow-auto px-6 pb-6">
        <TestimonyEditor />
      </div>
    </div>
  );
}

export default function TestimonyClient({
  initialTestimony,
}: {
  initialTestimony: Testimony;
}) {
  return (
    <TestimonyEditorContextProvider>
      <TestimonyEditorView testimony={initialTestimony} />
    </TestimonyEditorContextProvider>
  );
}
