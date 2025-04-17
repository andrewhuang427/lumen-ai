import { useContext } from "react";
import {
  BibleStudyPostContext,
  type BibleStudyPostContextType,
} from "../bible-study-post-context.provider";

export default function useBibleStudyPostContext(): BibleStudyPostContextType {
  return useContext(BibleStudyPostContext);
}
