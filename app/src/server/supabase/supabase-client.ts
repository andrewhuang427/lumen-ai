import { createBrowserClient } from "@supabase/ssr";

export const getBrowserSupabase = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

export const browserSupabase = () => getBrowserSupabase();
