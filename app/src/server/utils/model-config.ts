import { UserTier } from "@prisma/client";
import { z } from "zod";
import { type Context } from "../context";

export const ModelSchema = z.enum(["lite", "pro"] as const);

export type ModelType = z.infer<typeof ModelSchema>;

export const ModelProviders = {
  openai: "openai",
} as const;

export type ModelProvider = keyof typeof ModelProviders;

export type Model = {
  name: string;
  description: string;
  type: ModelType;
  provider: ModelProvider;
  model: string;
};

export const OpenAIModels = {
  lite: "gpt-5.6-luna",
  pro: "gpt-5.6-sol",
  title: "gpt-5.6-luna",
  webSearch: "gpt-5.6-sol",
  balancedGeneration: "gpt-5.6-terra",
} as const;

const LiteModel: Model = {
  name: "Lumen Lite",
  description: "The basic model for free users",
  type: "lite",
  provider: ModelProviders.openai,
  model: OpenAIModels.lite,
};

const ProModel: Model = {
  name: "Lumen Pro",
  description: "The premium model for understanding the Bible",
  type: "pro",
  provider: ModelProviders.openai,
  model: OpenAIModels.pro,
};

export type TierConfigType = {
  tier: UserTier;
  defaultModel: Model;
  models: Array<Model>;
};

export const TierConfig: Record<UserTier, TierConfigType> = {
  FREE: {
    tier: UserTier.FREE,
    defaultModel: LiteModel,
    models: [LiteModel],
  },
  PREMIUM: {
    tier: UserTier.PREMIUM,
    defaultModel: ProModel,
    models: [ProModel, LiteModel],
  },
};

export function isModelAllowedForTier(
  model: ModelType,
  userTier: UserTier,
): boolean {
  return TierConfig[userTier].models.some((m) => m.type === model);
}

export function getModel(ctx: Context, modelType: ModelType = "lite"): Model {
  const userTier = ctx.user?.tier ?? UserTier.FREE;
  const model = TierConfig[userTier].models.find((m) => m.type === modelType);

  if (!model) {
    throw new Error(`Model ${modelType} not found for ${userTier} tier`);
  }

  return model;
}
