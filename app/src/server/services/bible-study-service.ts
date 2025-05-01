import { type BibleBook, type BibleStudySession } from "@prisma/client";
import {
  type ChatCompletionAssistantMessageParam,
  type ChatCompletionSystemMessageParam,
  type ChatCompletionUserMessageParam,
} from "openai/resources/index.mjs";
import { z } from "zod";
import { type Context } from "../context";
import {
  BibleStudyNoteUnderstandSchema,
  BibleStudyNoteQuestionsSchema,
  toTypedNote,
  type CreateBibleStudyNoteType,
  type TypedBibleStudyNote,
  type UpdateBibleStudyNoteType,
} from "../utils/bible-note-utils";
import {
  getEnrichedSession,
  getIsValidQuestionObject,
  getUnderstandingMessageSystemPrompt,
  processVerseReferences,
} from "../utils/bible-study-utils";
import {
  type BibleChapterWithSections,
  type EnrichedBibleStudySession,
} from "../utils/bible-utils";
import { getModel, ModelSchema } from "../utils/model-config";
import { PermissionsService } from "./permissions-service";

type CreateSessionInput = {
  title: string;
  description?: string;
  bookId: string;
  startChapterId: string;
  endChapterId?: string;
  userId: string;
};

async function createSession(
  ctx: Context,
  input: CreateSessionInput,
): Promise<BibleStudySession> {
  return await ctx.db.bibleStudySession.create({
    data: {
      title: input.title,
      description: input.description,
      book_id: input.bookId,
      start_chapter_id: input.startChapterId,
      end_chapter_id: input.endChapterId,
      user_id: input.userId,
    },
  });
}

async function createSessionFromBookDetails(
  ctx: Context,
  userId: string,
  bookName: string,
  startChapterNumber: number,
  endChapterNumber?: number,
): Promise<BibleStudySession> {
  const book = await ctx.db.bibleBook.findFirstOrThrow({
    where: { name: bookName },
  });

  const startChapter = await ctx.db.bibleChapter.findFirstOrThrow({
    where: { book_id: book.id, number: startChapterNumber },
  });

  const endChapter = endChapterNumber
    ? await ctx.db.bibleChapter.findFirstOrThrow({
        where: { book_id: book.id, number: endChapterNumber },
      })
    : null;

  return await createSession(ctx, {
    title: `${bookName} ${startChapterNumber}${
      endChapterNumber ? `-${endChapterNumber}` : ""
    }`,
    description: `Bible study for ${bookName} ${startChapterNumber}${
      endChapterNumber ? `-${endChapterNumber}` : ""
    }`,
    bookId: book.id,
    startChapterId: startChapter.id,
    endChapterId: endChapter?.id,
    userId,
  });
}

type UpdateSessionInput = {
  sessionId: string;
  title: string;
  description?: string;
};

async function updateSession(
  ctx: Context,
  input: UpdateSessionInput,
): Promise<BibleStudySession> {
  await PermissionsService.validateBibleStudySessionBelongsToUser(
    ctx,
    input.sessionId,
  );

  return await ctx.db.bibleStudySession.update({
    where: { id: input.sessionId },
    data: {
      title: input.title,
      description: input.description,
    },
  });
}

async function deleteSession(
  ctx: Context,
  sessionId: string,
): Promise<BibleStudySession> {
  await PermissionsService.validateBibleStudySessionBelongsToUser(
    ctx,
    sessionId,
  );

  return await ctx.db.bibleStudySession.delete({
    where: { id: sessionId },
  });
}

async function getSession(
  ctx: Context,
  sessionId: string,
): Promise<EnrichedBibleStudySession> {
  await PermissionsService.validateBibleStudySessionBelongsToUser(
    ctx,
    sessionId,
  );

  return await getEnrichedSession(ctx, sessionId);
}

async function getSessionChapters(
  ctx: Context,
  sessionId: string,
): Promise<{
  book: BibleBook;
  chapters: BibleChapterWithSections[];
}> {
  const session = await getEnrichedSession(ctx, sessionId);
  return {
    chapters: session.chapters,
    book: session.book,
  };
}

async function getSessions(
  ctx: Context,
  userId: string,
): Promise<BibleStudySession[]> {
  return await ctx.db.bibleStudySession.findMany({
    where: { user_id: userId },
    orderBy: { created_at: "desc" },
  });
}

async function getNotes(
  ctx: Context,
  sessionId: string,
): Promise<TypedBibleStudyNote[]> {
  await PermissionsService.validateBibleStudySessionBelongsToUser(
    ctx,
    sessionId,
  );

  const notes = await ctx.db.bibleStudyNote.findMany({
    where: { session_id: sessionId },
    orderBy: { order: "asc" },
  });

  return notes.map(toTypedNote);
}

async function getNote(
  ctx: Context,
  noteId: string,
): Promise<TypedBibleStudyNote> {
  await PermissionsService.validateNoteBelongsToUser(ctx, noteId);

  const note = await ctx.db.bibleStudyNote.findUniqueOrThrow({
    where: { id: noteId },
  });

  return toTypedNote(note);
}

async function createNote(
  ctx: Context,
  input: CreateBibleStudyNoteType,
): Promise<TypedBibleStudyNote> {
  await PermissionsService.validateBibleStudySessionBelongsToUser(
    ctx,
    input.sessionId,
  );

  const notes = await getNotes(ctx, input.sessionId);
  const order = notes.length + 1;

  const note = await ctx.db.bibleStudyNote.create({
    data: {
      session_id: input.sessionId,
      type: input.type,
      data: input.data,
      order,
    },
  });

  return toTypedNote(note);
}

async function updateNote(
  ctx: Context,
  input: UpdateBibleStudyNoteType,
): Promise<TypedBibleStudyNote> {
  await PermissionsService.validateNoteBelongsToUser(ctx, input.id);

  const updatedNote = await ctx.db.bibleStudyNote.update({
    where: { id: input.id },
    data: {
      type: input.type,
      data: input.data,
    },
  });

  return toTypedNote(updatedNote);
}

export const SendUnderstandingMessageInput = z.object({
  noteId: z.string(),
  message: z.string(),
  model: ModelSchema.optional(),
});

export const GenerateQuestionResponseInput = z.object({
  noteId: z.string(),
  questionIndex: z.number(),
  question: z.string(),
  model: ModelSchema.optional(),
});

async function* sendUnderstandingMessage(
  ctx: Context,
  input: z.infer<typeof SendUnderstandingMessageInput>,
): AsyncGenerator<string> {
  await PermissionsService.validateNoteBelongsToUser(ctx, input.noteId);

  const note = await ctx.db.bibleStudyNote.findUniqueOrThrow({
    where: { id: input.noteId },
  });

  try {
    const { data } = BibleStudyNoteUnderstandSchema.parse(note);
    const { verses, messages: prevMessages } = data;

    const systemMessage: ChatCompletionSystemMessageParam = {
      role: "system",
      content: getUnderstandingMessageSystemPrompt(verses),
    };

    const newMessage = {
      role: "user",
      content: input.message,
    };

    const newMessages: (
      | ChatCompletionAssistantMessageParam
      | ChatCompletionUserMessageParam
    )[] = [...prevMessages, newMessage].map((m) => {
      return {
        role: m.role === "user" ? "user" : "assistant",
        content: m.content,
      };
    });

    const model = getModel(ctx, input.model);

    const completion = await ctx.openai.chat.completions.create({
      model: model.model,
      messages: [systemMessage, ...newMessages],
      stream: true,
    });

    let content = "";
    for await (const chunk of completion) {
      const deltaContent = chunk.choices[0]?.delta.content ?? "";
      content += deltaContent;
      yield deltaContent;
    }

    // Update the note with the new content
    await ctx.db.bibleStudyNote.update({
      where: { id: input.noteId },
      data: {
        data: {
          ...data,
          messages: [
            ...data.messages,
            newMessage,
            { role: "assistant", content },
          ],
        },
      },
    });
  } catch {
    throw new Error("Note is not of type UNDERSTANDING");
  }
}

async function* generateQuestionResponse(
  ctx: Context,
  input: z.infer<typeof GenerateQuestionResponseInput>,
): AsyncGenerator<string> {
  await PermissionsService.validateNoteBelongsToUser(ctx, input.noteId);

  const note = await ctx.db.bibleStudyNote.findUniqueOrThrow({
    where: { id: input.noteId },
  });

  try {
    const { data } = BibleStudyNoteQuestionsSchema.parse(note);
    const { questions } = data;

    if (input.questionIndex < 0 || input.questionIndex >= questions.length) {
      throw new Error("Question index is out of bounds");
    }

    const questionData = questions[input.questionIndex];
    if (!questionData) {
      throw new Error("Question not found");
    }

    const verses = questionData.verses ?? [];

    const systemPrompt = `You are BibleBuddy, an AI assistant that helps with Bible study questions.
    
Your task is to provide a thoughtful, insightful response to the following Bible study question.
    
Guidelines:
1. Give a clear, direct answer to the question that reflects orthodox Christian theology.
2. Be extremely concise - aim for 100-150 words maximum.
3. Support your answer with 1-2 specific references from the Bible text.
4. Use conversational language - write as if you're a knowledgeable friend giving a quick, helpful explanation.
5. Focus on the most important aspects of the question rather than trying to be comprehensive.
6. Avoid theological jargon and complex explanations.
7. Prioritize clarity and brevity over exhaustive analysis.

${verses.length > 0 ? `This question relates specifically to verse(s): ${verses.join(", ")}` : ""}`;

    const model = getModel(ctx, input.model);

    const completion = await ctx.openai.chat.completions.create({
      model: model.model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: input.question },
      ],
      stream: true,
    });

    let content = "";
    let buffer = "";
    const minChunkSize = 3;

    for await (const chunk of completion) {
      const deltaContent = chunk.choices[0]?.delta.content ?? "";
      buffer += deltaContent;
      content += deltaContent;

      // Yield chunks when buffer reaches minimum size or when there's a natural break
      if (
        buffer.length >= minChunkSize ||
        (buffer.length > 0 &&
          (deltaContent.includes(" ") || deltaContent.includes("\n")))
      ) {
        yield buffer;
        buffer = "";
      }
    }

    if (buffer.length > 0) {
      yield buffer;
    }

    questions[input.questionIndex] = {
      ...questionData,
      generatedResponse: content,
    };

    await ctx.db.bibleStudyNote.update({
      where: { id: input.noteId },
      data: {
        data: {
          ...data,
          questions,
        },
      },
    });
  } catch {
    throw new Error("Failed to generate question response");
  }
}

export const GenerateQuestionsInput = z.object({
  bookName: z.string(),
  passageText: z.string(),
  numQuestions: z.number().optional(),
  model: ModelSchema.optional(),
});

export type GeneratedQuestion = {
  question: string;
  verses: string[];
};

async function* generateQuestions(
  ctx: Context,
  input: z.infer<typeof GenerateQuestionsInput>,
): AsyncGenerator<GeneratedQuestion> {
  const model = getModel(ctx, input.model);

  // 1. determine the number of questions to generate
  let numQuestions = input.numQuestions;
  if (!numQuestions) {
    numQuestions = 4;
    try {
      const determineNumPrompt = `You are a Bible study assistant. Based on the length and complexity of the following passage, determine the appropriate number of questions to generate (3, 4, or 5).
      
      Book: ${input.bookName}
      Passage: ${input.passageText}
      
      Respond with ONLY a single number (3, 4, or 5).`;

      const response = await ctx.openai.chat.completions.create({
        model: model.model,
        messages: [{ role: "system", content: determineNumPrompt }],
        temperature: 0.3,
      });

      const content = response.choices[0]?.message.content?.trim();
      if (content) {
        const parsedNum = parseInt(content, 10);
        if (!isNaN(parsedNum) && parsedNum >= 3 && parsedNum <= 5) {
          numQuestions = parsedNum;
        }
      }
    } catch (error) {
      throw error;
    }
  }

  const previousQuestions: string[] = [];
  const previousVerses: string[] = [];

  // 2. generate questions in sequence
  for (let i = 0; i < numQuestions; i++) {
    const systemPrompt = `You are a Bible study assistant that creates thought-provoking questions that help readers engage with scripture.
    
    Your task is to generate ONE insightful question about the provided passage that:
    1. Follows the chronological order of the text
    2. Connects specific details to deeper spiritual truths
    3. Is clear and focused (20-30 words)
    
    ${i > 0 ? `This is question #${i + 1} of ${numQuestions}. Focus ONLY on content that appears AFTER verses ${previousVerses.join(", ")} which were addressed in previous questions.` : `This is the first question of ${numQuestions}. Focus on the beginning of the passage.`}
    
    Guidelines:
    - Ground your question in specific content, characters, events, or language from the passage
    - Connect these textual details to theological themes about God's character, purpose, and our relationship with Him
    - Help readers see how God's truth is revealed through specific details in this text
    - Include 1-2 specific verse references that directly relate to your question
    - IMPORTANT: Merge adjacent verse references into ranges (e.g., use "Philippians 2:6-8" instead of "Philippians 2:6, Philippians 2:7, Philippians 2:8")
    
    Format your response as a single JSON object:
    {"question": "The question text", "verses": ["verse reference 1", "verse reference 2"]}
    
    For verse references:
    - Use the format "Book Chapter:Verse" (e.g., "John 3:16")
    - For verse ranges, use "Book Chapter:StartVerse-EndVerse" (e.g., "Romans 8:28-30")
    - Do NOT repeat the book name for adjacent verses (use "John 3:16-17" not "John 3:16, John 3:17")
    
    Output ONLY the JSON object, no other text.`;

    const userPrompt = `Book: ${input.bookName}
    Passage: ${input.passageText}
    
    ${i > 0 ? `Previous questions focused on: ${previousQuestions.map((q, idx) => `Q${idx + 1}: "${q}" (verses: ${previousVerses[idx] ?? "none"})`).join("; ")}` : ""}
    
    Generate a focused question that:
    1. Addresses content that appears ${i === 0 ? "at the beginning" : "AFTER the content addressed in previous questions"}
    2. Connects specific details to deeper spiritual truths
    3. Helps readers discover God's message in this text
    
    Your question should follow the natural flow of the passage and focus on the next part chronologically.
    
    Remember to merge adjacent verse references into ranges (e.g., use "Philippians 2:6-8" instead of listing each verse separately).`;

    try {
      const response = await ctx.openai.chat.completions.create({
        model: model.model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
      });

      const content = response.choices[0]?.message.content?.trim();
      if (content == null) {
        continue;
      }

      try {
        const parsedResponse = JSON.parse(content) as GeneratedQuestion;
        if (getIsValidQuestionObject(content)) {
          const processedVerses = processVerseReferences(parsedResponse.verses);
          previousQuestions.push(parsedResponse.question);
          previousVerses.push(processedVerses.join(", "));
          yield {
            question: parsedResponse.question,
            verses: processedVerses,
          };
        }
      } catch {
        yield {
          question: content.trim(),
          verses: [],
        };
      }
    } catch (error) {
      throw error;
    }
  }
}

async function deleteNote(
  ctx: Context,
  noteId: string,
): Promise<TypedBibleStudyNote> {
  await PermissionsService.validateNoteBelongsToUser(ctx, noteId);

  const deletedNote = await ctx.db.bibleStudyNote.delete({
    where: { id: noteId },
  });

  return toTypedNote(deletedNote);
}

type ReorderNotesInput = {
  sessionId: string;
  noteIds: string[];
};

async function reorderNotes(
  ctx: Context,
  input: ReorderNotesInput,
): Promise<void> {
  await PermissionsService.validateBibleStudySessionBelongsToUser(
    ctx,
    input.sessionId,
  );

  const noteIds = input.noteIds;
  for (let i = 0; i < noteIds.length; i++) {
    await ctx.db.bibleStudyNote.update({
      where: { id: noteIds[i] },
      data: { order: i + 1 },
    });
  }
}

export const BibleStudyService = {
  createSession,
  createSessionFromBookDetails,
  updateSession,
  deleteSession,
  getSession,
  getSessionChapters,
  getSessions,
  getNotes,
  getNote,
  createNote,
  updateNote,
  sendUnderstandingMessage,
  generateQuestionResponse,
  generateQuestions,
  deleteNote,
  reorderNotes,
};
