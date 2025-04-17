import { db } from "../../db";
import { getBibleVersions } from "./api-bible-utils";

async function main() {
  const versions = await getBibleVersions();
  for (const version of versions) {
    const createdVersion = await db.bibleVersion.create({
      data: {
        name: version.name,
        abbreviation: version.abbreviation,
        description: version.description,
        language: version.language.name,
      },
    });
    console.log(`Created version ${createdVersion.name}`);
  }
}

void main();
