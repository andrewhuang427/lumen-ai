import { type BibleStudyNote, BibleStudyNoteType } from "@prisma/client";
import { z } from "zod";

// Base Schemas

const BibleStudyNoteVerseSchema = z.object({
  id: z.string(),
  book: z.string(),
  chapter: z.number(),
  verse: z.number(),
  text: z.string(),
});

const BibleStudyNoteVerseGroupSchema = z.array(BibleStudyNoteVerseSchema);

export type BibleStudyNoteVerseType = z.infer<typeof BibleStudyNoteVerseSchema>;

export type BibleStudyNoteVerseGroupType = z.infer<
  typeof BibleStudyNoteVerseGroupSchema
>;

const BibleStudyNoteQuoteBaseSchema = z.object({
  type: z.literal(BibleStudyNoteType.QUOTE),
  data: z.object({
    verses: z.array(BibleStudyNoteVerseGroupSchema),
    commentary: z.string(),
  }),
});

const BibleStudyNoteUnderstandBaseSchema = z.object({
  type: z.literal(BibleStudyNoteType.UNDERSTANDING),
  data: z.object({
    verses: z.array(BibleStudyNoteVerseGroupSchema),
    messages: z.array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      }),
    ),
  }),
});

const BibleStudyNoteFreeFormBaseSchema = z.object({
  type: z.literal(BibleStudyNoteType.FREE_FORM),
  data: z.object({
    commentary: z.string(),
  }),
});

const BibleStudyNoteQuestionsBaseSchema = z.object({
  type: z.literal(BibleStudyNoteType.QUESTIONS),
  data: z.object({
    questions: z.array(
      z.object({
        question: z.string(),
        response: z.string().optional(),
        verses: z.array(z.string()).optional(),
        generatedResponse: z.string().optional(),
      }),
    ),
  }),
});

// Create Note Schema

const CreateBibleStudyNoteBaseSchema = z.object({
  sessionId: z.string(),
});

const CreateBibleStudyNoteQuoteSchema = CreateBibleStudyNoteBaseSchema.extend({
  type: z.literal(BibleStudyNoteType.QUOTE),
  data: BibleStudyNoteQuoteBaseSchema.shape.data,
});

const CreateBibleStudyNoteUnderstandSchema =
  CreateBibleStudyNoteBaseSchema.extend({
    type: z.literal(BibleStudyNoteType.UNDERSTANDING),
    data: BibleStudyNoteUnderstandBaseSchema.shape.data,
  });

const CreateBibleStudyNoteFreeFormSchema =
  CreateBibleStudyNoteBaseSchema.extend({
    type: z.literal(BibleStudyNoteType.FREE_FORM),
    data: BibleStudyNoteFreeFormBaseSchema.shape.data,
  });

const CreateBibleStudyNoteQuestionsSchema =
  CreateBibleStudyNoteBaseSchema.extend({
    type: z.literal(BibleStudyNoteType.QUESTIONS),
    data: BibleStudyNoteQuestionsBaseSchema.shape.data,
  });

const CreatesBibleStudyNoteSchema = z.discriminatedUnion("type", [
  CreateBibleStudyNoteQuoteSchema,
  CreateBibleStudyNoteUnderstandSchema,
  CreateBibleStudyNoteFreeFormSchema,
  CreateBibleStudyNoteQuestionsSchema,
]);

export type CreateBibleStudyNoteType = z.infer<
  typeof CreatesBibleStudyNoteSchema
>;

// Get Note Schema

const BibleStudyNoteBaseSchema = z.object({
  id: z.string(),
  order: z.number(),
  session_id: z.string(),
});

const BibleStudyNoteQuoteSchema = BibleStudyNoteBaseSchema.extend({
  type: z.literal(BibleStudyNoteType.QUOTE),
  data: BibleStudyNoteQuoteBaseSchema.shape.data,
});

const BibleStudyNoteUnderstandSchema = BibleStudyNoteBaseSchema.extend({
  type: z.literal(BibleStudyNoteType.UNDERSTANDING),
  data: BibleStudyNoteUnderstandBaseSchema.shape.data,
});

const BibleStudyNoteFreeFormSchema = BibleStudyNoteBaseSchema.extend({
  type: z.literal(BibleStudyNoteType.FREE_FORM),
  data: BibleStudyNoteFreeFormBaseSchema.shape.data,
});

const BibleStudyNoteQuestionsSchema = BibleStudyNoteBaseSchema.extend({
  type: z.literal(BibleStudyNoteType.QUESTIONS),
  data: BibleStudyNoteQuestionsBaseSchema.shape.data,
});

const BibleStudyNoteSchema = z.discriminatedUnion("type", [
  BibleStudyNoteQuoteSchema,
  BibleStudyNoteUnderstandSchema,
  BibleStudyNoteFreeFormSchema,
  BibleStudyNoteQuestionsSchema,
]);

export type BaseBibleStudyNote = z.infer<typeof BibleStudyNoteBaseSchema>;
export type TypedBibleStudyNoteQuote = z.infer<
  typeof BibleStudyNoteQuoteSchema
>;
export type TypedBibleStudyNoteUnderstand = z.infer<
  typeof BibleStudyNoteUnderstandSchema
>;
export type TypedBibleStudyNoteFreeForm = z.infer<
  typeof BibleStudyNoteFreeFormSchema
>;
export type TypedBibleStudyNoteQuestions = z.infer<
  typeof BibleStudyNoteQuestionsSchema
>;
export type TypedBibleStudyNote = z.infer<typeof BibleStudyNoteSchema>;

// Update Note Schema

const UpdateBibleStudyNoteBaseSchema = z.object({
  id: z.string(),
});

const UpdateBibleStudyNoteQuoteSchema = UpdateBibleStudyNoteBaseSchema.extend({
  type: z.literal(BibleStudyNoteType.QUOTE),
  data: BibleStudyNoteQuoteBaseSchema.shape.data.partial(),
});

const UpdateBibleStudyNoteUnderstandSchema =
  UpdateBibleStudyNoteBaseSchema.extend({
    type: z.literal(BibleStudyNoteType.UNDERSTANDING),
    data: BibleStudyNoteUnderstandBaseSchema.shape.data.partial(),
  });

const UpdateBibleStudyNoteFreeFormSchema =
  UpdateBibleStudyNoteBaseSchema.extend({
    type: z.literal(BibleStudyNoteType.FREE_FORM),
    data: BibleStudyNoteFreeFormBaseSchema.shape.data.partial(),
  });

const UpdateBibleStudyNoteQuestionsSchema =
  UpdateBibleStudyNoteBaseSchema.extend({
    type: z.literal(BibleStudyNoteType.QUESTIONS),
    data: BibleStudyNoteQuestionsBaseSchema.shape.data.partial(),
  });

const UpdateBibleStudyNoteSchema = z.discriminatedUnion("type", [
  UpdateBibleStudyNoteQuoteSchema,
  UpdateBibleStudyNoteUnderstandSchema,
  UpdateBibleStudyNoteFreeFormSchema,
  UpdateBibleStudyNoteQuestionsSchema,
]);

export type UpdateBibleStudyNoteType = z.infer<
  typeof UpdateBibleStudyNoteSchema
>;

// Utils

function toTypedNote(note: BibleStudyNote): TypedBibleStudyNote {
  try {
    return BibleStudyNoteSchema.parse(note);
  } catch (error) {
    // If parsing fails, ensure the note has the required fields based on its type
    const { type } = note;
    const data = note.data as Record<string, unknown>;

    if (type === BibleStudyNoteType.QUESTIONS) {
      // Ensure QUESTIONS note has all required fields
      const fixedData = {
        questions: Array.isArray(data?.questions)
          ? data.questions.map((q: unknown) => {
              if (typeof q === "object" && q !== null) {
                const qObj = q as Record<string, unknown>;
                return {
                  question:
                    typeof qObj.question === "string" ? qObj.question : "",
                  response:
                    typeof qObj.response === "string" ? qObj.response : "",
                  verses: Array.isArray(qObj.verses) ? qObj.verses : [],
                  generatedResponse:
                    typeof qObj.generatedResponse === "string"
                      ? qObj.generatedResponse
                      : "",
                };
              }
              return {
                question: "",
                response: "",
                verses: [],
                generatedResponse: "",
              };
            })
          : [],
      };

      const fixedNote = {
        ...note,
        data: fixedData,
      };

      return BibleStudyNoteSchema.parse(fixedNote);
    }

    // For other note types, rethrow the error
    throw error;
  }
}

export {
  CreatesBibleStudyNoteSchema,
  BibleStudyNoteSchema,
  BibleStudyNoteQuoteSchema,
  BibleStudyNoteUnderstandSchema,
  BibleStudyNoteFreeFormSchema,
  BibleStudyNoteQuestionsSchema,
  BibleStudyNoteVerseSchema,
  UpdateBibleStudyNoteSchema,
  toTypedNote,
};
