import { type User as DbUser } from "@prisma/client";
import { type User } from "@supabase/supabase-js";
import OpenAI from "openai";
import { db } from "~/server/db";
import { serverSupabase } from "./supabase/supabase-server-client";

export type Context = {
  db: typeof db;
  openai: OpenAI;
  headers: Headers;
  user: User | null;
  dbUser: DbUser | null;
};

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const headers = opts.headers;
  const authToken = headers.get("authorization");

  let user: User | null;
  try {
    if (authToken) {
      const serverClient = await serverSupabase();
      const { data } = await serverClient.auth.getUser(authToken);
      user = data.user;
    } else {
      user = null;
    }
  } catch {
    user = null;
  }

  let dbUser: DbUser | null = null;
  if (user?.id) {
    dbUser = await db.user.findUnique({
      where: { id: user.id },
    });
  }

  return {
    db,
    openai: new OpenAI({ apiKey: process.env.OPENAI_API_KEY }),
    ...opts,
    user,
    dbUser,
  };
};
