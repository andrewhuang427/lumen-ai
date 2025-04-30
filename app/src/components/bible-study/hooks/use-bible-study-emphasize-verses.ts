import { type BibleStudyNoteVerseGroupType } from "../../../server/utils/bible-note-utils";
import { getVerseId } from "../../utils/bible-utils";
import { useBibleStudyContentScrollableContext } from "../context/use-bible-study-content-scrollable-context";
import useBibleStudyContext from "../context/use-bible-study-context";

export default function useBibleStudyEmphasizeVerses() {
  const scrollableRef = useBibleStudyContentScrollableContext();
  const { setSelectedVerses } = useBibleStudyContext();

  function emphasizeVerses(
    verseGroups: BibleStudyNoteVerseGroupType[],
    shouldFadeOut = true,
  ) {
    setSelectedVerses([]);
    const scrollableElement = scrollableRef?.current;
    if (scrollableElement == null) {
      return;
    }

    const firstVerseGroup = verseGroups[0];
    const firstVerse = firstVerseGroup?.[0];
    if (firstVerse == null) {
      return;
    }

    const firstVerseId = getVerseId(firstVerse.id);
    const firstVerseElement = document.getElementById(firstVerseId);
    if (firstVerseElement == null) {
      return;
    }

    // 1. scroll to the first verse
    const scrollTop =
      firstVerseElement.offsetTop -
      scrollableElement.offsetTop -
      (scrollableElement.clientHeight - firstVerseElement.clientHeight) / 3;

    scrollableElement.scrollTo({
      top: Math.max(scrollTop, 0),
      behavior: "smooth",
    });

    // 2. highlight the verses
    const elements = verseGroups
      .map((g) => g.map((v) => document.getElementById(getVerseId(v.id))))
      .flatMap((verse) => verse);

    elements.forEach((element) => {
      if (element == null) {
        return;
      }
      element.style.color = "rgba(234, 179, 8)";
      if (shouldFadeOut) {
        setTimeout(() => {
          element.style.color = "";
        }, 1000);
      }
    });
  }

  function deemphasizeVerses(verseGroups: BibleStudyNoteVerseGroupType[]) {
    const elements = verseGroups
      .map((g) => g.map((v) => document.getElementById(getVerseId(v.id))))
      .flatMap((verse) => verse);

    elements.forEach((element) => {
      if (element == null) {
        return;
      }
      element.style.color = "";
    });
  }

  return { emphasizeVerses, deemphasizeVerses };
}
