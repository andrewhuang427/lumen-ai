import { SpeedInsights } from "@vercel/speed-insights/next";
import AuthContextProvider from "../components/auth/auth-context-provider";
import BibleReaderContextProvider from "../components/bible-reader/bible-reader-context-provider";
import AppProgressBar from "../components/layout/app-progress-bar";
import AppSidebarLayout from "../components/layout/app-sidebar-layout";
import ModelContextProvider from "../components/model/model-context-provider";
import { ThemeProvider } from "../components/theme/theme-provider";
import { Toaster } from "../components/ui/toaster";
import { getAuthenticatedSession } from "../server/utils/auth";
import { api } from "../trpc/server";

export default async function AuthenticatedProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, user] = await Promise.all([
    getAuthenticatedSession(),
    api.user.getAuthenticatedUser(),
  ]);

  return (
    <AuthContextProvider defaultSession={session} defaultUser={user}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <BibleReaderContextProvider>
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
  );
}
