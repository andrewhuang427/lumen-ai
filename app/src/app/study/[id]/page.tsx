import { api, HydrateClient } from "~/trpc/server";
import BibleStudy from "../../../components/bible-study/bible-study";
import BibleStudyContextProvider from "../../../components/bible-study/context/bible-study-context-provider";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function StudyPage({ params }: Props) {
  const sessionId = (await params).id;
  await Promise.all([
    api.bibleStudy.getSession.prefetch({ sessionId }),
    api.bibleStudy.getNotes.prefetch({ sessionId }),
  ]);

  return (
    <HydrateClient>
      <BibleStudyContextProvider sessionId={sessionId}>
        <BibleStudy />
      </BibleStudyContextProvider>
    </HydrateClient>
  );
}
