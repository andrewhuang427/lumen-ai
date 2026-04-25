import { type Testimony } from "@prisma/client";
import { type Context } from "../context";
import { z } from "zod";

export const CreateTestimonyInputSchema = z.object({
  title: z.string(),
  userId: z.string(),
});

type CreateTestimonyInput = z.infer<typeof CreateTestimonyInputSchema>;

async function createTestimony(
  ctx: Context,
  input: CreateTestimonyInput,
): Promise<Testimony> {
  return await ctx.db.testimony.create({
    data: {
      title: input.title,
      user_id: input.userId,
    },
  });
}

export const UpdateTestimonyInputSchema = z.object({
  testimonyId: z.string(),
  title: z.string().optional(),
  contentJson: z.object({}).passthrough().optional(),
  contentText: z.string().optional(),
});

export type UpdateTestimonyInput = z.infer<typeof UpdateTestimonyInputSchema>;

async function updateTestimony(
  ctx: Context,
  input: UpdateTestimonyInput,
): Promise<Testimony> {
  return await ctx.db.testimony.update({
    where: { id: input.testimonyId },
    data: {
      title: input.title,
      content_json: input.contentJson,
      content_text: input.contentText,
    },
  });
}

async function deleteTestimony(
  ctx: Context,
  testimonyId: string,
): Promise<Testimony> {
  return await ctx.db.testimony.delete({
    where: { id: testimonyId },
  });
}

async function getTestimony(
  ctx: Context,
  testimonyId: string,
): Promise<Testimony | null> {
  return await ctx.db.testimony.findUnique({
    where: { id: testimonyId },
  });
}

async function getUserTestimonies(
  ctx: Context,
  userId: string,
): Promise<Testimony[]> {
  return await ctx.db.testimony.findMany({
    where: { user_id: userId },
    orderBy: { updated_at: "desc" },
  });
}

export const TestimonyService = {
  createTestimony,
  updateTestimony,
  deleteTestimony,
  getTestimony,
  getUserTestimonies,
};