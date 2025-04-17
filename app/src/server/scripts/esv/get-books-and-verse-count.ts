import { db } from "../../db";

async function getBooksAndVerseCount() {
  const books = await db.bibleBook.findMany({
    orderBy: {
      number: "asc",
    },
  });

  const nameAndVerseCount: { name: string; verseCount: number }[] = [];

  for (const book of books) {
    const verses = await db.bibleVerse.findMany({
      where: {
        chapter: { book_id: book.id },
      },
    });

    nameAndVerseCount.push({
      name: book.name,
      verseCount: verses.length,
    });
  }

  console.log(nameAndVerseCount);
  console.log(
    "total verses",
    nameAndVerseCount.reduce((acc, book) => acc + book.verseCount, 0),
  );
}

void getBooksAndVerseCount();
