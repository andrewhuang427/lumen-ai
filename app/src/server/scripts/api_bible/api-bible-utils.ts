import axios from "axios";

const API_KEY = process.env.BIBLE_API_KEY;

type BibleVersion = {
  id: string;
  name: string;
  abbreviation: string;
  description: string;
  language: {
    name: string;
  };
};

type BibleBook = {
  id: string;
  name: string;
  nameLong: string;
  abbreviation: string;
};

type BibleChapter = {
  id: string;
  bibleId: string;
  number: string;
  bookId: string;
  reference: string;
};

type BibleChapterData = {
  id: string;
  bibleId: string;
  number: string;
  bookId: string;
  reference: string;
  content: string;
  copyright: string;
  next: {
    id: string;
    bookId: string;
    number: string;
  };
  previous?: {
    id: string;
    bookId: string;
    number: string;
  };
};

type BibleVerse = {
  id: string;
  orgId: string;
  bibleId: string;
  chapterId: string;
  content: string;
  reference: string;
  verseCount: number;
  copyright: string;
};

export async function getBibleVersions(): Promise<BibleVersion[]> {
  const response = await axios.get(
    "https://api.scripture.api.bible/v1/bibles",
    { headers: { "api-key": API_KEY } },
  );
  const responseData = response.data as { data: BibleVersion[] };
  return responseData.data;
}

export async function getBibleBooks(versionId: string): Promise<BibleBook[]> {
  const response = await axios.get(
    `https://api.scripture.api.bible/v1/bibles/${versionId}/books`,
    { headers: { "api-key": API_KEY } },
  );
  const responseData = response.data as { data: BibleBook[] };
  return responseData.data;
}

export async function getBibleChapters(
  bibleId: string,
  bookId: string,
): Promise<BibleChapter[]> {
  const response = await axios.get(
    `https://api.scripture.api.bible/v1/bibles/${bibleId}/books/${bookId}/chapters`,
    { headers: { "api-key": API_KEY } },
  );

  const responseData = response.data as { data: BibleChapter[] };
  return responseData.data;
}

export async function getBibleChapter(bibleId: string, chapterId: string) {
  const response = await axios.get(
    `https://api.scripture.api.bible/v1/bibles/${bibleId}/chapters/${chapterId}`,
    { headers: { "api-key": API_KEY } },
  );
  const responseData = response.data as { data: BibleChapterData };
  return responseData.data;
}

export async function getBibleVerses(bibleId: string, chapterId: string) {
  const response = await axios.get(
    `https://api.scripture.api.bible/v1/bibles/${bibleId}/chapters/${chapterId}/verses`,
    { headers: { "api-key": API_KEY } },
  );
  const responseData = response.data as { data: BibleVerse[] };
  return responseData.data;
}

export async function getBibleVerseDetails(bibleId: string, verseId: string) {
  const response = await axios.get(
    `https://api.scripture.api.bible/v1/bibles/${bibleId}/verses/${verseId}`,
    { headers: { "api-key": API_KEY } },
  );
  const responseData = response.data as { data: BibleVerse };
  return responseData.data;
}
