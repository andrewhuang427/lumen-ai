import "server-only";

import { createHydrationHelpers } from "@trpc/react-query/rsc";
import { cookies as getCookies, headers as getHeaders } from "next/headers";
import { cache } from "react";
import { createCaller, type AppRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/context";
import { createQueryClient } from "./query-client";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
  const headers = new Headers(await getHeaders());
  const cookies = await getCookies();

  headers.set("x-trpc-source", "rsc");
  headers.set("cookie", cookies.toString());

  const mappedCookies = new Map(cookies);
  const accessToken = mappedCookies.get("access-token")?.value;
  if (accessToken) {
    headers.set("authorization", accessToken);
  }

  return createTRPCContext({
    headers,
  });
});

const getQueryClient = cache(createQueryClient);
const caller = createCaller(createContext);

export const { trpc: api, HydrateClient } = createHydrationHelpers<AppRouter>(
  caller,
  getQueryClient,
);
