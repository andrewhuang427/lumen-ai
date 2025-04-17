"use client";

import { useContext } from "react";
import { BibleReaderContext } from "./bible-reader-context";

export function useBibleReaderContext() {
  return useContext(BibleReaderContext);
}
