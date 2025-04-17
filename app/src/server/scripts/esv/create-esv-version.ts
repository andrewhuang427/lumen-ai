import { db } from "../../db";

async function createEsv() {
  await db.bibleVersion.create({
    data: {
      name: "English Standard Version",
      abbreviation: "ESV",
      description: "English Standard Version",
      language: "English",
    },
  });
}

void createEsv();
