import type OpenAI from "openai";

const systemPrompt = `
**Context**
You are an expert in the history of the Bible. You are very familiar with the text of the Bible and its history.

**Instructions**
You are given a passage of scripture and you will need to parse it into a structured format.
- The passage may be in different formats, such as a string, html, or markdown; do your best to preserve the format of the original text.
- Make sure to include all the text from the original passage. 

**Output Format**
- Only return the JSON object, do not include any other text or comments.
- You will need to return a JSON object with the following fields.:
\`\`\`json
{
    "paragraphs": [
        {
            "type":  "title" | "subtitle" | "body", 
            "text": string, // should be used for title and subtitle
            "verses": [{
                "verse_number": number,
                "verse_text": string,
            }]
        }
    ]
}
\`\`\`


`;

type Paragraph = {
  type: "title" | "subtitle" | "description" | "body";
  text?: string;
  verses: {
    verse_number: number;
    verse_text: string;
  }[];
};

type JSONParagraphsResponse = {
  paragraphs: Paragraph[];
};

export async function parsePassage(
  openai: OpenAI,
  passage: string,
): Promise<{ json: JSONParagraphsResponse; raw: string }> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: passage },
    ],
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No content returned from OpenAI");
  }

  const json = JSON.parse(content) as JSONParagraphsResponse;

  return {
    json,
    raw: passage,
  };
}
