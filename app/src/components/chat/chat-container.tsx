"use client";

import { type PropsWithChildren } from "react";
import { ResizablePanel, ResizablePanelGroup } from "../ui/resizable";
import ChatThreadsSidebar from "./chat-threads-sidebar";

export default function ChatContainer({ children }: PropsWithChildren) {
  return (
    <ResizablePanelGroup direction="horizontal">
      <ChatThreadsSidebar />
      <ResizablePanel defaultSize={80} className="relative">
        {children}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
