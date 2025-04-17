"use client";

import { useIsMobile } from "../../hooks/use-mobile";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";
import BibleStudyContent from "./bible-study-content";
import BibleStudyHeader from "./bible-study-header";
import { BibleStudyContentScrollableContextProvider } from "./context/bible-study-content-scrollable-context";
import BibleStudyNotesPanel from "./notes/bible-study-notes-panel";
import { BibleStudyNotesPanelScrollableContextProvider } from "./notes/context/bible-study-notes-panel-scrollable-context";

export default function BibleStudy() {
  const isMobile = useIsMobile();

  return (
    <BibleStudyContentScrollableContextProvider>
      <BibleStudyNotesPanelScrollableContextProvider>
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={70}>
            <div className="relative flex h-full w-full flex-col">
              <BibleStudyHeader />
              <BibleStudyContent />
            </div>
          </ResizablePanel>
          {/* Hide study panel on mobile */}
          {!isMobile && (
            <>
              <ResizableHandle withHandle={true} />
              <ResizablePanel className="min-w-[500px] overflow-hidden">
                <BibleStudyNotesPanel />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </BibleStudyNotesPanelScrollableContextProvider>
    </BibleStudyContentScrollableContextProvider>
  );
}
