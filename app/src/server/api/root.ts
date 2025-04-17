import { bibleRouter } from "~/server/api/routers/bible";
import { bibleStudyRouter } from "~/server/api/routers/bible-study";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { bibleStudyPostRouter } from "./routers/bible-study-post";
import { chatRouter } from "./routers/chat";
import { discoverFeedRouter } from "./routers/discover-feed";
import { userRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  bible: bibleRouter,
  bibleStudy: bibleStudyRouter,
  bibleStudyPost: bibleStudyPostRouter,
  discover: discoverFeedRouter,
  chat: chatRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
