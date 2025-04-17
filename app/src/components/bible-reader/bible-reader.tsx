import BibleReaderContent from "./bible-reader-content";
import BibleReaderHeaderV2 from "./bible-reader-header-v2";
import { BibleReaderPageHeader } from "./bible-reader-page-header";
import BibleReaderTools from "./bible-reader-tools";

export default function BibleReader() {
  return (
    <div className="relative flex h-full w-full flex-col">
      <BibleReaderPageHeader />
      <BibleReaderHeaderV2 />
      <BibleReaderContent />
      <BibleReaderTools />
    </div>
  );
}
