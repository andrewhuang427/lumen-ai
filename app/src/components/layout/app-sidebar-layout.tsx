"use client";

import { type PropsWithChildren } from "react";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";
import AppSidebar from "./app-sidebar";
import { useIsMobile } from "../../hooks/use-mobile";
type Props = PropsWithChildren;

export default function AppSidebarLayout({ children }: Props) {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      <AppSidebar />
      {isMobile ? (
        <main className="relative flex h-dvh w-full flex-col overflow-hidden">
          {children}
        </main>
      ) : (
        <SidebarInset>
          <main className="relative flex h-[calc(100svh-theme(spacing.16))] grow flex-col overflow-hidden">
            {children}
          </main>
        </SidebarInset>
      )}
    </SidebarProvider>
  );
}
