"use client";

import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { type VersesPosition } from "../utils/tooltip-positioning";

interface BibleStudyVerseIndicatorProps {
  areVersesInView: boolean;
  versesPosition: VersesPosition;
  className?: string;
}

/**
 * Component that shows an indicator when verses are out of view,
 * with an arrow pointing in the direction of the verses
 */
export default function BibleStudyVerseIndicator({
  areVersesInView,
  versesPosition,
  className = "",
}: BibleStudyVerseIndicatorProps) {
  if (areVersesInView) {
    return null;
  }

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {versesPosition === "below" ? (
        <ArrowDownCircle size={16} className="animate-bounce text-amber-400" />
      ) : (
        <ArrowUpCircle size={16} className="animate-bounce text-amber-400" />
      )}
      <span className="text-amber-400">Out of view</span>
    </div>
  );
}

/**
 * Returns a CSS class string for pulse animation based on the pulse state
 */
export function getPulseAnimationClass(showPulse: boolean): string {
  return showPulse ? "scale-105" : "scale-100";
}
