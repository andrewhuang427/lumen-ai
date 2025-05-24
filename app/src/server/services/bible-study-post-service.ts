import {
  BibleStudyPostStatus,
  BibleStudyPostType,
  type BibleStudyPost,
} from "@prisma/client";
import { type Context } from "../context";

import {
  type ChatCompletionSystemMessageParam,
  type ChatCompletionUserMessageParam,
} from "openai/resources/index.mjs";
import { z } from "zod";
import {
  getEnrichedSession,
  getSummarizeMessageSystemPrompt,
} from "../utils/bible-study-utils";

export const CreatePostInputSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  status: z.nativeEnum(BibleStudyPostStatus),
  contentJson: z.object({}).passthrough(),
  contentText: z.string(),
  sessionId: z.string(),
});

export type CreatePostInput = z.infer<typeof CreatePostInputSchema>;

async function createPost(
  ctx: Context,
  input: CreatePostInput,
): Promise<BibleStudyPost> {
  if (ctx.user == null) {
    throw new Error("User not found");
  }

  return await ctx.db.bibleStudyPost.create({
    data: {
      type: BibleStudyPostType.TEXT,
      status: input.status,
      title: input.title,
      description: input.description,
      content_json: input.contentJson,
      content_text: input.contentText,
      session_id: input.sessionId,
      user_id: ctx.user.id,
    },
  });
}

export const CreatePostImageInputSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string(),
  sessionId: z.string(),
});

type CreatePostImageInput = z.infer<typeof CreatePostImageInputSchema>;

async function createPostImage(
  ctx: Context,
  input: CreatePostImageInput,
): Promise<BibleStudyPost> {
  if (ctx.user == null) {
    throw new Error("User not found");
  }

  return await ctx.db.bibleStudyPost.create({
    data: {
      type: BibleStudyPostType.IMAGE,
      status: BibleStudyPostStatus.PUBLISHED,
      title: input.title,
      description: input.description,
      session_id: input.sessionId,
      user_id: ctx.user.id,
      images: {
        create: {
          url: input.imageUrl,
        },
      },
    },
  });
}

async function* summarizeSession(
  ctx: Context,
  sessionId: string,
): AsyncGenerator<string> {
  const enrichedSession = await getEnrichedSession(ctx, sessionId);
  const sessionNotes = await ctx.db.bibleStudyNote.findMany({
    where: { session_id: sessionId },
  });

  const systemMessage: ChatCompletionSystemMessageParam = {
    role: "system",
    content: getSummarizeMessageSystemPrompt(enrichedSession, sessionNotes),
  };

  const userMessage: ChatCompletionUserMessageParam = {
    role: "user",
    content: `- Help me to concisely summarize my Bible Study Session. 
    - Write the summary in first person perspective.
    - The summary should be in markdown format.
    - Use a casual tone. The summary should be easy to read and understand. It should not sound like a professional summary or formal essay.
    - Divide the summary into 4 sections: scripture, notes, questions, and prayer.
    - Only use heading 1 and heading 2.`,
  };

  const completion = await ctx.openai.chat.completions.create({
    model: "gpt-4o",
    messages: [systemMessage, userMessage],
    stream: true,
  });

  for await (const chunk of completion) {
    yield chunk.choices[0]?.delta.content ?? "";
  }
}

export const UpdatePostInputSchema = z.object({
  postId: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  type: z.nativeEnum(BibleStudyPostType).optional(),
  status: z.nativeEnum(BibleStudyPostStatus).optional(),
  contentJson: z.object({}).passthrough().optional(),
  contentText: z.string().optional(),
});

export type UpdatePostInput = z.infer<typeof UpdatePostInputSchema>;

async function updatePost(
  ctx: Context,
  input: UpdatePostInput,
): Promise<BibleStudyPost> {
  return await ctx.db.bibleStudyPost.update({
    where: { id: input.postId },
    data: {
      title: input.title,
      description: input.description,
      type: input.type,
      status: input.status,
      content_json: input.contentJson,
      content_text: input.contentText,
    },
  });
}

async function deletePost(
  ctx: Context,
  postId: string,
): Promise<BibleStudyPost> {
  return await ctx.db.bibleStudyPost.delete({
    where: { id: postId },
  });
}

async function getPost(
  ctx: Context,
  sessionId: string,
): Promise<BibleStudyPost | null> {
  return await ctx.db.bibleStudyPost.findFirst({
    where: { session_id: sessionId },
  });
}

async function getUserPosts(
  ctx: Context,
  userId: string,
): Promise<BibleStudyPost[]> {
  return await ctx.db.bibleStudyPost.findMany({
    where: { user_id: userId },
  });
}

export const BibleStudyPostService = {
  createPost,
  createPostImage,
  summarizeSession,
  updatePost,
  deletePost,
  getPost,
  getUserPosts,
};
