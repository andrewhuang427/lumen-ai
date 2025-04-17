import { createContext, type PropsWithChildren, useRef } from "react";

export const BibleStudyContentScrollableContext =
  createContext<React.RefObject<HTMLDivElement> | null>(null);

type Props = PropsWithChildren;

export function BibleStudyContentScrollableContextProvider({
  children,
}: Props) {
  const scrollableRef = useRef<HTMLDivElement>(null);

  return (
    <BibleStudyContentScrollableContext.Provider value={scrollableRef}>
      {children}
    </BibleStudyContentScrollableContext.Provider>
  );
}
