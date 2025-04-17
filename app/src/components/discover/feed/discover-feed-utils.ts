export function saveScrollPosition(
  key: string,
  position: { top: number; left: number },
): void {
  try {
    sessionStorage.setItem(`scroll-position-${key}`, JSON.stringify(position));
  } catch (error) {
    console.warn("Failed to save scroll position:", error);
  }
}

export function getScrollPosition(key: string): { top: number; left: number } {
  try {
    const stored = sessionStorage.getItem(`scroll-position-${key}`);
    if (stored != null) {
      return JSON.parse(stored) as { top: number; left: number };
    }
    return { top: 0, left: 0 };
  } catch {
    return { top: 0, left: 0 };
  }
}
