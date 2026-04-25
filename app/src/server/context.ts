import { type User } from "@prisma/client";
import { type User as SupabaseUser } from "@supabase/supabase-js";
import { type OpenAI } from "openai";
import { type Stripe } from "stripe";
import { db } from "~/server/db";
import { openai } from "./openai";
import { stripe } from "./stripe";
import { serverSupabase } from "./supabase/supabase-server-client";

export type Context = {
  db: typeof db;
  openai: OpenAI;
  stripe: Stripe;
  headers: Headers;
  supabaseUser: SupabaseUser | null;
  user: User | null;
};

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const headers = opts.headers;
  const authToken = headers.get("authorization");

  let supabaseUser: SupabaseUser | null;
  try {
    const serverClient = await serverSupabase();
    if (authToken) {
      const { data } = await serverClient.auth.getUser(authToken);
      supabaseUser = data.user;
    } else {
      // When the browser is still syncing getSession() but cookies are already set.
      const { data } = await serverClient.auth.getUser();
      supabaseUser = data.user;
    }
  } catch {
    supabaseUser = null;
  }

  return {
    db,
    openai,
    stripe,
    supabaseUser,
    user: null,
    ...opts,
  };
};
