import { drawVerticalLineTest, drawIntersectionDot } from './verticalLineTest';

export const circle = {
    key: 'circle',
    label: 'Circle',
    draw: (
      ctx: CanvasRenderingContext2D,
      { width, height, verticalLineX }: { width: number; height: number; verticalLineX?: number }
    ) => {
      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(width, height) / 3;
      // Draw the circle
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw vertical line test if requested
      if (verticalLineX !== undefined) {
        drawVerticalLineTest(ctx, verticalLineX, height);
        // Calculate intersection(s) and draw dot(s)
        const dx = verticalLineX - cx;
        if (Math.abs(dx) <= radius) {
          const dy = Math.sqrt(radius * radius - dx * dx);
          // Two intersection points (top and bottom)
          drawIntersectionDot(ctx, verticalLineX, cy - dy);
          drawIntersectionDot(ctx, verticalLineX, cy + dy);
        }
      }
    },
    getIntersection: (
      x: number,
      width: number,
      height: number
    ): number[] => {
      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(width, height) / 3;
      const dx = x - cx;
      if (Math.abs(dx) > radius) return [];
      const dy = Math.sqrt(radius * radius - dx * dx);
      return [cy - dy, cy + dy];
    }
  };