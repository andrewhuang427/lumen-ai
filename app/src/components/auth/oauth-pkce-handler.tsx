"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { browserSupabase } from "../../server/supabase/supabase-client";

const pkceCodesHandled = new Set<string>();

/**
 * Finishes the browser OAuth PKCE flow when Supabase redirects with ?code=.
 * Relying only on the client's implicit URL handling is flaky in the App Router;
 * we explicitly exchange the code and strip query params.
 */
function OauthPkceHandlerInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code || pkceCodesHandled.has(code)) return;
    pkceCodesHandled.add(code);

    void (async () => {
      const supabase = browserSupabase();
      const { data: pre } = await supabase.auth.getSession();
      if (pre.session) {
        const u = new URL(window.location.href);
        u.searchParams.delete("code");
        u.searchParams.delete("state");
        router.replace(u.pathname + u.search);
        return;
      }
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        pkceCodesHandled.delete(code);
        return;
      }
      const u = new URL(window.location.href);
      u.searchParams.delete("code");
      u.searchParams.delete("state");
      router.replace(u.pathname + (u.search ? u.search : ""));
    })();
  }, [searchParams, router]);

  return null;
}

export function OauthPkceHandler() {
  return (
    <Suspense fallback={null}>
      <OauthPkceHandlerInner />
    </Suspense>
  );
}
