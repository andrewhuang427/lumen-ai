import OpenAI from "openai";
import { env } from "../env";

const createOpenAI = () => new OpenAI({ apiKey: env.OPENAI_API_KEY });

const globalForOpenAI = globalThis as unknown as {
  openai: ReturnType<typeof createOpenAI> | undefined;
};

export const openai = globalForOpenAI.openai ?? createOpenAI();

if (env.NODE_ENV !== "production") globalForOpenAI.openai = openai;
