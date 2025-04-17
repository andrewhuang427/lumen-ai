import { useContext } from "react";
import { BibleStudyContentScrollableContext } from "./bible-study-content-scrollable-context";

export function useBibleStudyContentScrollableContext() {
  return useContext(BibleStudyContentScrollableContext);
}
