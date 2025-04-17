import axios from "axios";

type ResponseData = {
  query: string;
  canonical: string;
  content: string;
  parsed: [number, number];
  passage_meta: {
    canonical: string;
    chapter_start: [number, number];
    chapter_end: [number, number];
    prev_verse: number;
    next_verse: number;
    prev_chapter: [number, number];
    next_chapter: [number, number];
  };
  passages: [string];
};

type EsvAPIOptions = {
  "include-headings"?: boolean;
  "include-verse-numbers"?: boolean;
  "include-footnotes"?: boolean;
  "include-short-copyright"?: boolean;
  "include-passage-horizontal-lines"?: boolean;
  "include-heading-horizontal-lines"?: boolean;
};

const API_KEY = process.env.ESV_BIBLE_API_KEY;

export async function getPassageText(
  query: string,
  options: EsvAPIOptions = {
    "include-headings": true,
    "include-verse-numbers": true,
    "include-footnotes": false,
    "include-short-copyright": false,
    "include-passage-horizontal-lines": false,
    "include-heading-horizontal-lines": true,
  },
) {
  const response = await axios.get("https://api.esv.org/v3/passage/text/", {
    headers: { Authorization: `Token ${API_KEY}` },
    params: { q: query, ...options },
  });

  return response.data as ResponseData;
}
