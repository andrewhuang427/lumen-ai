import { type Session } from "@supabase/supabase-js";

function secureCookieAttribute(): string {
  if (typeof window !== "undefined" && window.location.protocol === "https:") {
    return "; secure";
  }
  return "";
}

export const setSessionCookies = (session: Session | null) => {
  const sec = secureCookieAttribute();
  if (session) {
    const maxAge = 100 * 365 * 24 * 60 * 60; // 100 years, never expires

    document.cookie = `access-token=${session.access_token}; path=/; max-age=${maxAge}; SameSite=Lax${sec}`;
    document.cookie = `refresh-token=${session.refresh_token}; path=/; max-age=${maxAge}; SameSite=Lax${sec}`;
  } else {
    const expires = new Date(0).toUTCString();

    document.cookie = `access-token=; path=/; expires=${expires}; SameSite=Lax${sec}`;
    document.cookie = `refresh-token=; path=/; expires=${expires}; SameSite=Lax${sec}`;
  }
};
