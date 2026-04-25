import { type Testimony } from "@prisma/client";
import { redirect } from "next/navigation";
import { db } from "~/server/db";
import { getServerSupabase } from "~/server/supabase/supabase-server-client";
import TestimonyClient from "./testimony-client";

async function ensureUserTestimony(userId: string): Promise<Testimony> {
  const existing = await db.testimony.findFirst({
    where: { user_id: userId },
    orderBy: { updated_at: "desc" },
  });

  if (existing) {
    return existing;
  }

  return db.testimony.create({
    data: {
      title: "My Testimony",
      user_id: userId,
    },
  });
}

export default async function TestimonyPage() {
  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

  const testimony = await ensureUserTestimony(user.id);

  return <TestimonyClient initialTestimony={testimony} />;
}
