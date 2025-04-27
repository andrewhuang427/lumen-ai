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
import { ThemeProvider } from "../components/theme/theme-provider";
import { Toaster } from "../components/ui/toaster";
import { getAuthenticatedSession } from "../server/utils/auth";
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
  const [session, user, readingLocation] = await Promise.all([
    getAuthenticatedSession(),
    api.user.getAuthenticatedUser(),
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
          <TRPCReactProvider>
            <AuthContextProvider defaultSession={session} defaultUser={user}>
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
        </PostHogContextProvider>
      </body>
    </html>
  );
}
