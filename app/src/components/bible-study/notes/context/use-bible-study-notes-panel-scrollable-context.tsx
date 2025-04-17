import { useContext } from "react";
import { BibleStudyNotesPanelScrollableContext } from "./bible-study-notes-panel-scrollable-context";

export default function useBibleStudyNotesPanelScrollableContext() {
  return useContext(BibleStudyNotesPanelScrollableContext);
}
