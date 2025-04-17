import { BibleStudyNoteType, type BibleStudyNote } from "@prisma/client";
import { type Context } from "../context";
import { type GeneratedQuestion } from "../services/bible-study-service";
import {
  toTypedNote,
  type BibleStudyNoteVerseGroupType,
} from "./bible-note-utils";
import {
  convertChapterToChapterWithSections,
  type BibleChapterWithSections,
  type EnrichedBibleStudySession,
} from "./bible-utils";

// ================ Bible Study Understand Note System Prompt ================

export const SYSTEM_PROMPT = `**Context**
You are an assistant specialized in helping users study the Bible. You:
- Reference scripture directly and accurately.
- Focus on historical, theological, and cultural contexts of the Bible.
- Stick strictly to scriptural text and do not invent information. THIS IS VERY IMPORTANT.
      
**Verses**
The user is studying the following verses of the bible: {bible verses here}
      
**Instructions**
- Answer questions about the verses the user is studying.
- Quote scripture wherever possible. Be concise and accurate.
- If asked a question unrelated to the Bible, kindly ask the user to rephrase or guide them back to scripture.
- Be concise and to the point. Try to answer the question in a few sentences.
- Please do not use markdown formatting. Speak in plain text and conversationally.
`;

export function getUnderstandingMessageSystemPrompt(
  verses: BibleStudyNoteVerseGroupType[],
) {
  const versesString = verses
    .map((versesGroup) =>
      versesGroup
        .map(
          (verse) =>
            `${verse.book} ${verse.chapter}:${verse.verse} - ${verse.text}`,
        )
        .join("\n"),
    )
    .join("\n\n");

  return SYSTEM_PROMPT.replace("{bible verses here}", versesString);
}

// ================ Bible Study Summarize Note System Prompt ================

export const SUMMARIZE_SYSTEM_PROMPT = `**Context**
You are helping someone share their Bible study journey with their friends. Your role is to:
- Create a genuine, personal summary of their study session
- Share scripture in a relatable, down-to-earth way
- Highlight their honest reflections and discoveries

**Session**
Here's what they studied: {session context}

**Notes**
Here are their thoughts and reflections: {organized notes}

**Instructions**
- Write like you're sharing with friends over coffee
- Feel free to express wonder, questions, or even confusion
- Include scripture quotes, but explain them conversationally
- Be real and vulnerable - it's okay to not have all the answers
- Share both the "aha!" moments and the challenging parts
- Let your personality shine through

Remember: This is a heart-to-heart sharing of someone's personal journey with scripture.`;

export function getSummarizeMessageSystemPrompt(
  enrichedSession: EnrichedBibleStudySession,
  notes: BibleStudyNote[],
) {
  const sessionContext = getSessionContext(enrichedSession);
  const organizedNotes = organizeNotes(notes);
  return SUMMARIZE_SYSTEM_PROMPT.replace(
    "{session context}",
    sessionContext,
  ).replace("{organized notes}", organizedNotes);
}

function getSessionContext(enrichedSession: EnrichedBibleStudySession) {
  let sessionContext = "";

  const bookName = enrichedSession.book.name;
  const chapterStart = enrichedSession.start_chapter_id;
  const chapterEnd = enrichedSession.end_chapter_id;

  // 1. include book name and chapter numbers
  sessionContext += `**Bible Book and Chapters**
  The user is studying ${bookName} ${chapterStart} ${chapterEnd != null ? `to ${chapterEnd}` : ""}`;

  // 2. include the bible text
  sessionContext += `**Bible Text**
  ${enrichedSession.chapters
    .flatMap((c) =>
      c.sections.flatMap((s) =>
        s.verses.map((v) => `${v.verse_number}: ${v.text}`),
      ),
    )
    .join("\n")}
  `;
  return sessionContext;
}

function organizeNotes(notes: BibleStudyNote[]) {
  let organizedNotes = "";

  for (const note of notes) {
    const typedNote = toTypedNote(note);
    switch (typedNote.type) {
      case BibleStudyNoteType.UNDERSTANDING:
        organizedNotes += `**Understanding Note**
        The understanding note allows users to chat with a bible study assistant about a specific verse.
        1. The user specifies the verse they are studying.
        2. The user asks a question about the verse.
        3. The assistant answers the question using the verse as context.

        The current understanding note included the following verses and messages:

        **Verses**
        ${typedNote.data.verses.map((group) => group.map((v) => `${v.book} ${v.chapter}:${v.verse} - ${v.text}`)).join("\n\n")}

        **Messages**
        ${typedNote.data.messages.map((message) => `${message.role}: ${message.content}`).join("\n")}
        `;
        break;
      case BibleStudyNoteType.QUOTE:
        organizedNotes += `**Quote Note**
        The quote note allows users to quote a specific verse.
        1. The user specifies the verse they are studying.
        2. The user comments on the verse.

        The current quote note included the following verse:

        **Verse**
        ${typedNote.data.verses.map((group) => group.map((v) => `${v.book} ${v.chapter}:${v.verse} - ${v.text}`)).join("\n\n")}

        **Commentary**
        ${typedNote.data.commentary}
        `;
        break;
      case BibleStudyNoteType.FREE_FORM:
        organizedNotes += `**Free Form Note**
        The free form note allows users to write a free form comment on a specific verse.

        **Commentary**
        ${typedNote.data.commentary}
        `;
        break;
      default:
        break;
    }

    organizedNotes += "\n\nEnd of note\n\n";
  }

  return organizedNotes;
}

/**
 * Get an enriched session with the chapters and verses
 * @param ctx - The database context
 * @param sessionId - The session id
 * @returns The enriched session
 */
export async function getEnrichedSession(
  ctx: Context,
  sessionId: string,
): Promise<EnrichedBibleStudySession> {
  const session = await ctx.db.bibleStudySession.findUniqueOrThrow({
    where: { id: sessionId },
    include: { book: true },
  });

  const startChapterId = session.start_chapter_id;
  const endChapterId = session.end_chapter_id;

  const chapters: BibleChapterWithSections[] = [];
  if (endChapterId == null) {
    // Get the start chapter
    const startChapter = await ctx.db.bibleChapter.findUniqueOrThrow({
      where: { id: startChapterId },
      include: { verses: true, headings: true },
    });
    chapters.push(convertChapterToChapterWithSections(startChapter));
  } else {
    // Get all chapters between start and end
    const startChapter = await ctx.db.bibleChapter.findUniqueOrThrow({
      where: { id: startChapterId },
      include: { verses: true, headings: true },
    });
    const endChapter = await ctx.db.bibleChapter.findUniqueOrThrow({
      where: { id: endChapterId },
      include: { verses: true, headings: true },
    });

    chapters.push(convertChapterToChapterWithSections(startChapter));
    for (let num = startChapter.number + 1; num < endChapter.number; num++) {
      const chapter = await ctx.db.bibleChapter.findUniqueOrThrow({
        where: { book_id_number: { book_id: session.book_id, number: num } },
        include: {
          verses: true,
          headings: true,
        },
      });
      chapters.push(convertChapterToChapterWithSections(chapter));
    }
    chapters.push(convertChapterToChapterWithSections(endChapter));
  }

  return {
    ...session,
    chapters,
  };
}

// ================ Bible Study Generate Questions System Prompt ================

export const getIsValidQuestionObject = (generatedQuestionString: string) => {
  try {
    const parsedQuestion = JSON.parse(
      generatedQuestionString,
    ) as GeneratedQuestion;
    if (
      typeof parsedQuestion.question === "string" &&
      Array.isArray(parsedQuestion.verses) &&
      parsedQuestion.verses.every((v: unknown) => typeof v === "string")
    ) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

export function processVerseReferences(verses: string[]): string[] {
  if (!verses || verses.length === 0) return [];

  // Basic cleanup
  return (
    verses
      .map((verse) => verse.trim())
      // Remove any duplicates
      .filter((verse, index, self) => self.indexOf(verse) === index)
  );
}
