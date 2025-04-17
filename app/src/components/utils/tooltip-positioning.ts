// Positioning constants
export const PADDING = 16;
export const TOP_OFFSET = 24;
export const VERSE_TOP_OFFSET = 80;
export const BOTTOM_OFFSET = 72;
export const THRESHOLD = 60;
export const OUT_OF_VIEW_OFFSET = 20;

export type VersesPosition = "above" | "below" | "visible";

/**
 * Determines if an element is within the viewport and its position
 */
export const isElementInViewport = (
  elementRect: DOMRect,
  viewportRect: DOMRect,
): { inView: boolean; position: VersesPosition } => {
  const isVisible =
    elementRect.bottom > viewportRect.top &&
    elementRect.top < viewportRect.bottom;

  if (!isVisible) {
    if (elementRect.bottom <= viewportRect.top) {
      return { inView: false, position: "above" };
    } else if (elementRect.top >= viewportRect.bottom) {
      return { inView: false, position: "below" };
    }
  }
  return { inView: true, position: "visible" };
};

/**
 * Calculates the optimal position for a tooltip
 */
export const calculateTooltipPosition = (
  elementRect: DOMRect,
  viewportRect: DOMRect,
  isElementInView: boolean,
): { top: number; left: number } => {
  const minTop = viewportRect.top + PADDING;
  const maxTop = viewportRect.bottom - PADDING;
  const centerX = viewportRect.left + viewportRect.width / 2;

  // If element is out of view, position at the top of viewport
  if (!isElementInView) {
    return {
      top: minTop + OUT_OF_VIEW_OFFSET,
      left: centerX,
    };
  }

  // Calculate position based on element location
  let tooltipPos = { top: minTop, left: centerX };

  // Element is at the top of the viewport
  if (elementRect.top < viewportRect.top + THRESHOLD) {
    tooltipPos = {
      top: viewportRect.top + TOP_OFFSET,
      left: centerX,
    };
  }
  // Element is partly scrolled out at the bottom
  else if (
    elementRect.bottom > viewportRect.bottom &&
    elementRect.top < viewportRect.bottom
  ) {
    tooltipPos = {
      top: Math.min(
        elementRect.top - VERSE_TOP_OFFSET,
        viewportRect.bottom - BOTTOM_OFFSET,
      ),
      left: centerX,
    };
  }
  // Element is approaching the bottom
  else if (elementRect.bottom > viewportRect.bottom - THRESHOLD) {
    tooltipPos = {
      top: viewportRect.bottom - BOTTOM_OFFSET,
      left: centerX,
    };
  }
  // Element is in the middle
  else {
    tooltipPos = {
      top: elementRect.top - VERSE_TOP_OFFSET,
      left: elementRect.left + elementRect.width / 2,
    };
  }

  // Ensure tooltip stays within viewport bounds
  tooltipPos.top = Math.max(minTop, Math.min(tooltipPos.top, maxTop));

  return tooltipPos;
};
