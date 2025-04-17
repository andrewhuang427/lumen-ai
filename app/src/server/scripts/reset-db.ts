import { db } from "../db";

export async function resetDb() {
  await db.bibleHeading.deleteMany();
  await db.bibleVerse.deleteMany();
  await db.bibleChapter.deleteMany();
  await db.bibleBook.deleteMany();
  await db.bibleVersion.deleteMany();
}

void resetDb();
