import { useContext } from "react";
import {
  BibleStudyContext,
  type BibleStudyContextType,
} from "./bible-study-context";

export default function useBibleStudyContext(): BibleStudyContextType {
  return useContext(BibleStudyContext);
}
