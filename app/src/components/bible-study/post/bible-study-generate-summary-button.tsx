"use client";

import { type Editor, generateJSON } from "@tiptap/react";
import { Loader2, NotebookPen } from "lucide-react";
import * as marked from "marked";
import { useEffect, useState } from "react";
import { api } from "../../../trpc/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../ui/alert-dialog";
import { Button } from "../../ui/button";
import useBibleStudyContext from "../context/use-bible-study-context";
import { usePostEditor } from "./hooks/use-post-editor";
import { defaultExtensions } from "./post-editor-context-provider";

export default function BibleStudyGenerateSummaryButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmationRequired, setIsConfirmationRequired] = useState(false);

  const { session } = useBibleStudyContext();
  const editor = usePostEditor();

  const { mutateAsync: summarizeSession } =
    api.bibleStudyPost.summarizeSession.useMutation();

  // Check if the user has written any content
  useEffect(() => {
    function handleUpdate(updatedEditor: Editor) {
      const content = updatedEditor.getText();
      if (content.length === 0) {
        // If the user has not written any content, do not show the confirmation dialog
        setIsConfirmationRequired(false);
      } else {
        // If the user has written any content, show the confirmation dialog
        setIsConfirmationRequired(true);
      }
    }

    editor?.on("update", ({ editor: updatedEditor }) => {
      handleUpdate(updatedEditor);
    });

    return () => {
      editor?.off("update");
    };
  }, [editor]);

  async function handleGenerateSummary() {
    if (session == null || editor == null) {
      return;
    }

    try {
      setIsLoading(true);
      const generator = await summarizeSession({
        sessionId: session.id,
      });

      let summary = "";
      for await (const chunk of generator) {
        summary += chunk;
        const json = summaryToJson(summary);
        editor.commands.setContent(json, false);
      }
      const json = summaryToJson(summary);
      editor.commands.setContent(json, true);
    } finally {
      setIsLoading(false);
    }
  }

  const summarizeButton = (
    <Button
      variant="secondary"
      disabled={isLoading}
      onClick={handleGenerateSummary}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Summarizing...
        </>
      ) : (
        <>
          <NotebookPen />
          Summarize
        </>
      )}
    </Button>
  );

  if (isConfirmationRequired) {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="secondary">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <NotebookPen />
            )}
            Summarize
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Once you generate a new summary, your previous content will be
              replaced.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>{summarizeButton}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return summarizeButton;
}

function summaryToJson(summary: string) {
  const markdown = marked.parse(summary, { async: false });
  const json = generateJSON(markdown, defaultExtensions);
  return json;
}
