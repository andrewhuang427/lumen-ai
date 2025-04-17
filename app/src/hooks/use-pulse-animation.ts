import { useEffect, useState } from "react";

interface UsePulseAnimationOptions {
  /**
   * Whether to trigger the pulse animation
   */
  trigger: boolean;
  /**
   * Duration of the pulse animation in milliseconds
   * @default 1500
   */
  duration?: number;
}

/**
 * Hook for creating a pulse animation effect
 * Returns a boolean that can be used to toggle CSS classes or styles
 */
export function usePulseAnimation({
  trigger,
  duration = 1500,
}: UsePulseAnimationOptions): boolean {
  const [showPulse, setShowPulse] = useState(false);

  useEffect(() => {
    if (trigger) {
      setShowPulse(true);
      const timer = setTimeout(() => setShowPulse(false), duration);
      return () => clearTimeout(timer);
    }
  }, [trigger, duration]);

  return showPulse;
}
