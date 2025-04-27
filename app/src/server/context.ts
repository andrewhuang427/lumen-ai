import { type User } from "@prisma/client";
import { type User as SupabaseUser } from "@supabase/supabase-js";
import OpenAI from "openai";
import { db } from "~/server/db";
import { serverSupabase } from "./supabase/supabase-server-client";

export type Context = {
  db: typeof db;
  openai: OpenAI;
  headers: Headers;
  supabaseUser: SupabaseUser | null;
  user: User | null;
};

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const headers = opts.headers;
  const authToken = headers.get("authorization");

  let supabaseUser: SupabaseUser | null;
  try {
    if (authToken) {
      const serverClient = await serverSupabase();
      const { data } = await serverClient.auth.getUser(authToken);
      supabaseUser = data.user;
    } else {
      supabaseUser = null;
    }
  } catch {
    supabaseUser = null;
  }

  let user: User | null = null;
  if (supabaseUser?.id) {
    user = await db.user.findUnique({
      where: { id: supabaseUser.id },
    });
  }

  return {
    db,
    openai: new OpenAI({ apiKey: process.env.OPENAI_API_KEY }),
    supabaseUser,
    user,
    ...opts,
  };
};
