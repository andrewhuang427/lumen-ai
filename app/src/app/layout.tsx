import "~/styles/globals.css";

import { SpeedInsights } from "@vercel/speed-insights/next";
import { GeistSans } from "geist/font/sans";
import { type Metadata, type Viewport } from "next";
import { TRPCReactProvider } from "~/trpc/react";
import AuthContextProvider from "../components/auth/auth-context-provider";
import BibleReaderContextProvider from "../components/bible-reader/bible-reader-context-provider";
import AppProgressBar from "../components/layout/app-progress-bar";
import AppSidebarLayout from "../components/layout/app-sidebar-layout";
import ModelContextProvider from "../components/model/model-context-provider";
import PostHogContextProvider from "../components/posthog/posthog-context-provider";
import PosthogFeatureConfigProvider from "../components/posthog/posthog-feature-config-provider";
import { ThemeProvider } from "../components/theme/theme-provider";
import { Toaster } from "../components/ui/toaster";
import { getFeatureConfig } from "../server/posthog/posthog-utils";
import { getServerUser } from "../server/utils/auth";
import { api } from "../trpc/server";

export const metadata: Metadata = {
  title: "Lumen",
  description: "The copilot that helps you learn the stories of the Bible",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { user, session, dbUser } = await getServerUser();
  const [featureConfig, readingLocation] = await Promise.all([
    getFeatureConfig(user),
    api.user.getReadingLocation(),
  ]);

  return (
    <html
      lang="en"
      className={`${GeistSans.variable}`}
      suppressHydrationWarning
    >
      <body className="m-0 h-dvh w-full overflow-hidden p-0">
        <PostHogContextProvider>
          <PosthogFeatureConfigProvider featureConfig={featureConfig}>
            <TRPCReactProvider>
              <AuthContextProvider
                user={user}
                session={session}
                dbUser={dbUser}
              >
                <ThemeProvider
                  attribute="class"
                  defaultTheme="system"
                  enableSystem
                  disableTransitionOnChange
                >
                  <BibleReaderContextProvider
                    defaultReadingLocation={readingLocation}
                  >
                    <ModelContextProvider>
                      <AppSidebarLayout>
                        <AppProgressBar />
                        <SpeedInsights />
                        {children}
                        <Toaster />
                      </AppSidebarLayout>
                    </ModelContextProvider>
                  </BibleReaderContextProvider>
                </ThemeProvider>
              </AuthContextProvider>
            </TRPCReactProvider>
          </PosthogFeatureConfigProvider>
        </PostHogContextProvider>
      </body>
    </html>
  );
}
