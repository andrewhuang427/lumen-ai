"use client";

import { createContext, useRef, type PropsWithChildren } from "react";

export const BibleStudyNotesPanelScrollableContext =
  createContext<React.RefObject<HTMLDivElement> | null>(null);

type Props = PropsWithChildren;

export function BibleStudyNotesPanelScrollableContextProvider({
  children,
}: Props) {
  const scrollableRef = useRef<HTMLDivElement>(null);

  return (
    <BibleStudyNotesPanelScrollableContext.Provider value={scrollableRef}>
      {children}
    </BibleStudyNotesPanelScrollableContext.Provider>
  );
}
