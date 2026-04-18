"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import TestimonyEditorContextProvider from "~/components/testimony/context/testimony-editor-context-provider";
import TestimonyEditor from "~/components/testimony/testimony-editor";
import TestimonyEditorToolbar from "~/components/testimony/toolbar/testimony-editor-toolbar";
import useTestimonyAutoSave from "~/components/testimony/hooks/use-testimony-auto-save";
import { useTestimonyEditor } from "~/components/testimony/context/use-testimony-editor-context";
import Header from "~/components/header/header";
import { type Testimony } from "@prisma/client";

function TestimonyEditorView({ testimony }: { testimony: Testimony }) {
  const editor = useTestimonyEditor();
  const saveStatus = useTestimonyAutoSave(testimony);

  const [title, setTitle] = useState(testimony.title);

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

export default function TestimonyPage() {
  const { data: testimonies, isLoading } =
    api.testimony.getUserTestimonies.useQuery();

  const utils = api.useUtils();
  const { mutateAsync: createTestimony } =
    api.testimony.createTestimony.useMutation();

  const [currentTestimony, setCurrentTestimony] = useState<Testimony | null>(
    null,
  );
  const [isCreating, setIsCreating] = useState(false);

  // Auto-create first testimony if none exists
  useEffect(() => {
    async function ensureTestimony() {
      if (isLoading) return;
      if (testimonies && testimonies.length > 0) {
        setCurrentTestimony(testimonies[0]!);
        return;
      }
      if (testimonies && testimonies.length === 0 && !currentTestimony) {
        setIsCreating(true);
        try {
          const newTestimony = await createTestimony({
            title: "My Testimony",
          });
          await utils.testimony.getUserTestimonies.invalidate();
          setCurrentTestimony(newTestimony);
        } finally {
          setIsCreating(false);
        }
      }
    }
    void ensureTestimony();
  }, [testimonies, isLoading, currentTestimony, createTestimony, utils]);

  if (isLoading || isCreating || !currentTestimony) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <TestimonyEditorContextProvider>
      <TestimonyEditorView testimony={currentTestimony} />
    </TestimonyEditorContextProvider>
  );
}