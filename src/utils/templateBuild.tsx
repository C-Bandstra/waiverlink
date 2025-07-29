export const normalizePosition = (
  mouseX: number,
  mouseY: number,
  container: DOMRect,
): { x: number; y: number } => {
  // Calculate position relative to the container's content area
  const normalizedX =
    (mouseX - container.left - window.scrollX) / container.width;
  const normalizedY =
    (mouseY - container.top - window.scrollY) / container.height;
  return {
    x: Math.max(0, Math.min(1, normalizedX)), // Clamp to [0, 1]
    y: Math.max(0, Math.min(1, normalizedY)),
  };
};

export const denormalizePosition = (
  normalizedX: number,
  normalizedY: number,
  containerWidth: number,
  containerHeight: number,
): { x: number; y: number } => {
  const absoluteX = normalizedX * containerWidth;
  const absoluteY = normalizedY * containerHeight;
  return { x: absoluteX, y: absoluteY };
};
