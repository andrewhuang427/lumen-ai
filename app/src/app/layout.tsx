import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata, type Viewport } from "next";
import { Suspense } from "react";
import { TRPCReactProvider } from "~/trpc/react";
import { OauthPkceHandler } from "../components/auth/oauth-pkce-handler";
import AuthenticatedProviders from "./authenticated-providers";
import RootLoadingScreen from "../components/root-loading-screen";
import PostHogContextProvider from "../components/posthog/posthog-context-provider";

export const metadata: Metadata = {
  title: "Lumen",
  description: "The copilot that helps you learn the stories of the Bible",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable}`}
      suppressHydrationWarning
    >
      <body className="m-0 h-dvh w-full overflow-hidden p-0">
        <PostHogContextProvider>
          <TRPCReactProvider>
            <OauthPkceHandler />
            <Suspense fallback={<RootLoadingScreen />}>
              <AuthenticatedProviders>{children}</AuthenticatedProviders>
            </Suspense>
          </TRPCReactProvider>
        </PostHogContextProvider>
      </body>
    </html>
  );
}
