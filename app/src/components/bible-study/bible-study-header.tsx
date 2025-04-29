import { Pencil } from "lucide-react";
import { type EnrichedBibleStudySession } from "../../server/utils/bible-utils";
import Header from "../header/header";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import BibleStudyDeleteButton from "./bible-study-delete-button";
import BibleStudyEditDialog from "./bible-study-edit-dialog";
import useBibleStudyContext from "./context/use-bible-study-context";
import BibleStudyPublishDialog from "./post/bible-study-publish-dialog";

export default function BibleStudyHeader() {
  const { session } = useBibleStudyContext();

  if (session == null) {
    return (
      <Header
        title={<Skeleton className="h-6 w-56" />}
        description={<Skeleton className="mt-1 h-6 w-24" />}
        end={
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
          </div>
        }
      />
    );
  }

  return (
    <Header
      title={session.title}
      description={getDescription(session)}
      end={
        <div className="flex shrink-0 items-center gap-2">
          <BibleStudyEditDialog
            session={session}
            trigger={
              <Button variant="secondary">
                <Pencil />
                Edit
              </Button>
            }
          />
          <BibleStudyDeleteButton />
          <BibleStudyPublishDialog />
        </div>
      }
    />
  );
}

function getDescription(session: EnrichedBibleStudySession) {
  return `${session.description ? `${session.description} - ` : ""} ${session.created_at.toLocaleDateString()}`;
}
