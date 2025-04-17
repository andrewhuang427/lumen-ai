import { type TypedBibleStudyNoteQuestions } from "../../../../server/utils/bible-note-utils";
import { type BibleStudyNoteQuestionItemType } from "./bible-study-note-question-item";

/**
 * Safely checks if a value is a valid object
 * @param value - The value to check
 * @returns True if the value is a non-null object
 */
function isValidObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/**
 * Initializes questions from note data with proper type checking
 * @param note - The Bible study note containing question data
 * @returns An array of properly formatted question items
 */
export function initializeQuestions(
  note: TypedBibleStudyNoteQuestions,
): BibleStudyNoteQuestionItemType[] {
  if (
    !note.data ||
    !isValidObject(note.data) ||
    !Array.isArray(note.data.questions)
  ) {
    return [];
  }

  return note.data.questions.map((q) => {
    if (isValidObject(q)) {
      return {
        question: q.question,
        response: q.response ?? "",
        verses: Array.isArray(q.verses) ? q.verses : [],
        generatedResponse: q.generatedResponse,
      };
    }

    return {
      question: "Untitled Question",
      response: "",
      verses: [],
      generatedResponse: "",
    };
  });
}

/**
 * Gets all verses from all questions
 * @param questions - The array of question items
 * @returns A flattened array of all verse groups from all questions
 */
export function getAllVerses(questions: BibleStudyNoteQuestionItemType[]) {
  if (!Array.isArray(questions)) {
    return [];
  }

  return questions.flatMap((q) => q.verses || []);
}
