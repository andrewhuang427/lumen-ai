import { PostHog } from "posthog-node";
import { env } from "~/env";

export function getPostHogClient() {
  const client = new PostHog(env.POSTHOG_API_KEY, {
    host: env.POSTHOG_HOST,
  });

  return client;
}

export async function shutdownPostHogClient(client: PostHog): Promise<void> {
  await client.shutdown();
}
