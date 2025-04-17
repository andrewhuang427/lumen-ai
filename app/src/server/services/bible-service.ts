import {
  type BibleBook,
  type BibleChapter,
  type BibleVerse,
} from "@prisma/client";
import { z } from "zod";
import { type Context } from "../context";
import {
  type BibleChapterWithSections,
  type BibleVersionWithCount,
  getChapterSections,
} from "../utils/bible-utils";

async function getVersions(ctx: Context): Promise<BibleVersionWithCount[]> {
  return await ctx.db.bibleVersion.findMany({
    include: {
      _count: {
        select: {
          books: true,
        },
      },
    },
  });
}

async function getBooks(ctx: Context, versionId: string): Promise<BibleBook[]> {
  return await ctx.db.bibleBook.findMany({
    where: { version_id: versionId },
    orderBy: { number: "asc" },
  });
}

async function getChapters(
  ctx: Context,
  bookId: string,
): Promise<BibleChapter[]> {
  return await ctx.db.bibleChapter.findMany({
    where: { book_id: bookId },
    orderBy: { number: "asc" },
  });
}

async function getChapter(
  ctx: Context,
  chapterId: string,
): Promise<BibleChapterWithSections> {
  const chapter = await ctx.db.bibleChapter.findUniqueOrThrow({
    where: { id: chapterId },
    include: {
      verses: true,
      headings: true,
    },
  });

  return {
    ...chapter,
    sections: getChapterSections(chapter),
  };
}

export const GetVersesSchema = z.object({
  versionId: z.string(),
  bookName: z.string(),
  chapterNumber: z.number(),
  startVerseNumber: z.number(),
  endVerseNumber: z.number().optional(),
});

type GetVersesOptions = z.infer<typeof GetVersesSchema>;

async function getVerses(
  ctx: Context,
  options: GetVersesOptions,
): Promise<BibleVerse[]> {
  const book = await ctx.db.bibleBook.findFirstOrThrow({
    where: {
      name: options.bookName,
      version_id: options.versionId,
    },
  });

  const chapter = await ctx.db.bibleChapter.findFirstOrThrow({
    where: {
      book_id: book.id,
      number: options.chapterNumber,
    },
  });

  return await ctx.db.bibleVerse.findMany({
    where: {
      chapter_id: chapter.id,
      verse_number: {
        gte: options.startVerseNumber,
        lte: options.endVerseNumber ?? options.startVerseNumber,
      },
    },
    orderBy: {
      verse_number: "asc",
    },
  });
}

export const BibleService = {
  getVersions,
  getBooks,
  getChapters,
  getChapter,
  getVerses,
};
