"use client";

import { type Testimony } from "@prisma/client";
import { useCallback, useEffect, useRef, useState } from "react";
import Header from "~/components/header/header";
import { cn } from "~/lib/utils";
import TestimonyEditorContextProvider from "~/components/testimony/context/testimony-editor-context-provider";
import { useTestimonyEditor } from "~/components/testimony/context/use-testimony-editor-context";
import useTestimonyAutoSave from "~/components/testimony/hooks/use-testimony-auto-save";
import TestimonyEditor from "~/components/testimony/testimony-editor";
import TestimonyEditorToolbar from "~/components/testimony/toolbar/testimony-editor-toolbar";

function TestimonyEditorView({ testimony }: { testimony: Testimony }) {
  const editor = useTestimonyEditor();
  const saveStatus = useTestimonyAutoSave(testimony);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showToolbarMask, setShowToolbarMask] = useState(false);

  const updateToolbarMask = useCallback(() => {
    const el = scrollRef.current;
    if (el == null) return;
    setShowToolbarMask(el.scrollTop > 1);
  }, []);

  const title = testimony.title;

  // Initialize editor content when testimony loads
  useEffect(() => {
    if (editor && testimony.content_json) {
      editor.commands.setContent(testimony.content_json as object);
    }
  }, [editor, testimony.content_json]);

  useEffect(() => {
    updateToolbarMask();
  }, [updateToolbarMask, testimony.content_json]);

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
      <div
        ref={scrollRef}
        onScroll={updateToolbarMask}
        className="relative min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-y-none"
      >
        <div className="sticky top-0 z-10 bg-background">
          <div className="mx-auto w-full max-w-3xl px-6">
            <TestimonyEditorToolbar />
          </div>
          <div
            className={cn(
              "pointer-events-none absolute inset-x-0 top-full z-[1] h-10 bg-gradient-to-b from-background to-transparent transition-opacity duration-200",
              showToolbarMask ? "opacity-100" : "opacity-0",
            )}
            aria-hidden
          />
        </div>
        <TestimonyEditor className="relative z-0 mx-auto w-full max-w-3xl px-6 pb-6" />
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
