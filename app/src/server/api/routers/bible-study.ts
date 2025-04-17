import { z } from "zod";
import {
  BibleStudyService,
  GenerateQuestionsInput,
  SendUnderstandingMessageInput,
  GenerateQuestionResponseInput,
} from "../../services/bible-study-service";
import {
  CreatesBibleStudyNoteSchema,
  UpdateBibleStudyNoteSchema,
} from "../../utils/bible-note-utils";
import { authenticatedProcedure, createTRPCRouter } from "../trpc";

export const bibleStudyRouter = createTRPCRouter({
  createSession: authenticatedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        bookId: z.string(),
        startChapterId: z.string(),
        endChapterId: z.string().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return BibleStudyService.createSession(ctx, {
        ...input,
        userId: ctx.user.id,
      });
    }),
  createSessionFromBookDetails: authenticatedProcedure
    .input(
      z.object({
        bookName: z.string(),
        startChapterNumber: z.number(),
        endChapterNumber: z.number().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return BibleStudyService.createSessionFromBookDetails(
        ctx,
        ctx.user.id,
        input.bookName,
        input.startChapterNumber,
        input.endChapterNumber,
      );
    }),
  updateSession: authenticatedProcedure
    .input(
      z.object({
        sessionId: z.string(),
        title: z.string(),
        description: z.string().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return BibleStudyService.updateSession(ctx, input);
    }),
  deleteSession: authenticatedProcedure
    .input(z.object({ sessionId: z.string() }))
    .mutation(({ ctx, input }) => {
      return BibleStudyService.deleteSession(ctx, input.sessionId);
    }),
  getSession: authenticatedProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(({ ctx, input }) => {
      return BibleStudyService.getSession(ctx, input.sessionId);
    }),
  getSessionChapters: authenticatedProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(({ ctx, input }) => {
      return BibleStudyService.getSessionChapters(ctx, input.sessionId);
    }),
  getSessions: authenticatedProcedure.query(({ ctx }) => {
    return BibleStudyService.getSessions(ctx, ctx.user.id);
  }),
  getNotes: authenticatedProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(({ ctx, input }) => {
      return BibleStudyService.getNotes(ctx, input.sessionId);
    }),
  getNote: authenticatedProcedure
    .input(z.object({ noteId: z.string() }))
    .query(({ ctx, input }) => {
      return BibleStudyService.getNote(ctx, input.noteId);
    }),
  createNote: authenticatedProcedure
    .input(CreatesBibleStudyNoteSchema)
    .mutation(({ ctx, input }) => {
      return BibleStudyService.createNote(ctx, input);
    }),
  updateNote: authenticatedProcedure
    .input(UpdateBibleStudyNoteSchema)
    .mutation(({ ctx, input }) => {
      return BibleStudyService.updateNote(ctx, input);
    }),
  sendUnderstandingMessage: authenticatedProcedure
    .input(SendUnderstandingMessageInput)
    .mutation(async function* ({ ctx, input }) {
      yield* BibleStudyService.sendUnderstandingMessage(ctx, input);
    }),
  generateQuestionResponse: authenticatedProcedure
    .input(GenerateQuestionResponseInput)
    .mutation(async function* ({ ctx, input }) {
      yield* BibleStudyService.generateQuestionResponse(ctx, input);
    }),
  generateQuestions: authenticatedProcedure
    .input(GenerateQuestionsInput)
    .mutation(async function* ({ ctx, input }) {
      yield* BibleStudyService.generateQuestions(ctx, input);
    }),
  deleteNote: authenticatedProcedure
    .input(z.object({ noteId: z.string() }))
    .mutation(({ ctx, input }) => {
      return BibleStudyService.deleteNote(ctx, input.noteId);
    }),
  reorderNotes: authenticatedProcedure
    .input(z.object({ sessionId: z.string(), noteIds: z.array(z.string()) }))
    .mutation(({ ctx, input }) => {
      return BibleStudyService.reorderNotes(ctx, input);
    }),
});
