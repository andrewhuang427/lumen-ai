"use client";

import { useEffect, useState } from "react";
import { useIsMobile } from "../../hooks/use-mobile";
import AuthDialog from "../auth/auth-dialog";
import useAuth from "../auth/use-auth";
import BibleStudyCreateDialog from "../bible-study/bible-study-create-dialog";
import HotKeyText from "../hotkey-text";
import { Button } from "../ui/button";
import { useBibleReaderContext } from "./use-bible-reader-context";

export default function BibleReaderTools() {
  const [isCreateStudyDialogOpen, setIsCreateStudyDialogOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

  const {
    selectedChapter,
    hasPreviousChapter,
    hasNextChapter,
    nextChapter,
    previousChapter,
  } = useBibleReaderContext();
  const { user } = useAuth();
  const isMobile = useIsMobile();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        previousChapter();
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        nextChapter();
      }
      if (e.key === "s" && (e.metaKey || e.ctrlKey)) {
        if (isMobile) {
          return;
        }
        e.preventDefault();
        if (user == null) {
          setIsAuthDialogOpen(true);
        } else {
          setIsCreateStudyDialogOpen(true);
        }
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [user, isMobile, nextChapter, previousChapter]);

  if (selectedChapter == null) {
    return null;
  }

  return (
    <>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 md:bottom-8">
        <div className="flex items-center gap-1 rounded-full border bg-muted py-2 pl-4 pr-2 shadow">
          {hasPreviousChapter && (
            <Button
              variant="ghost"
              className="shrink-0"
              onClick={previousChapter}
            >
              Previous <HotKeyText modifier="←" />
            </Button>
          )}
          {hasNextChapter && (
            <Button variant="ghost" className="shrink-0" onClick={nextChapter}>
              Next <HotKeyText modifier="→" />
            </Button>
          )}
          {!isMobile &&
            (user == null ? (
              <AuthDialog
                open={isAuthDialogOpen}
                onOpenChange={setIsAuthDialogOpen}
                trigger={
                  <Button
                    variant="default"
                    className="shrink-0"
                    onClick={() => setIsAuthDialogOpen(true)}
                  >
                    Study chapter <HotKeyText modifier="⌘" hotkey="S" />
                  </Button>
                }
              />
            ) : (
              <BibleStudyCreateDialog
                open={isCreateStudyDialogOpen}
                onOpenChange={setIsCreateStudyDialogOpen}
                trigger={
                  <Button
                    variant="default"
                    className="shrink-0 rounded-full"
                    onClick={() => setIsCreateStudyDialogOpen(true)}
                  >
                    Study chapter <HotKeyText modifier="⌘" hotkey="S" />
                  </Button>
                }
              />
            ))}
        </div>
      </div>
    </>
  );
}
