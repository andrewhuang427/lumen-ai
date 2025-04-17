import { db } from "../../db";
import { BOOKS } from "../../utils/bible-utils";

async function createEsvBooks() {
  const esvVersion = await db.bibleVersion.findUniqueOrThrow({
    where: { abbreviation: "ESV" },
  });

  for (let i = 0; i < BOOKS.length; ++i) {
    const book = BOOKS[i];
    if (book != null) {
      await db.bibleBook.create({
        data: {
          number: i + 1,
          name: book.name,
          abbreviation: book.abbreviation,
          version_id: esvVersion.id,
        },
      });
    }
  }
}

void createEsvBooks();
