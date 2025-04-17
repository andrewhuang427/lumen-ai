"use client";

import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { type PropsWithChildren } from "react";

type Props = PropsWithChildren;

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY!;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST!;

if (typeof window !== "undefined") {
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    person_profiles: "identified_only",
    loaded: (posthog) => {
      if (process.env.NODE_ENV === "development") {
        posthog.debug();
      }
    },
  });
}

export default function PostHogContextProvider({ children }: Props) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
