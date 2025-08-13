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

      // Draw vertical line and dots if requested
      if (verticalLineX !== undefined) {
        drawVerticalLineTest(ctx, verticalLineX, height);
        
        // Calculate intersections and draw dots
        const dx = verticalLineX - cx;
        if (Math.abs(dx) <= radius) {
          const dy = Math.sqrt(radius * radius - dx * dx);
          const isFailed = Math.abs(dx) !== 0; // Circle fails vertical line test unless line passes through center
          
          // Draw both intersection points (top and bottom)
          drawIntersectionDot(ctx, verticalLineX, cy - dy, 6, isFailed);
          drawIntersectionDot(ctx, verticalLineX, cy + dy, 6, isFailed);
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
      
      // No intersection if vertical line is outside the circle
      if (Math.abs(dx) > radius) return [];
      
      // If vertical line passes exactly through the center, it's a function (1 intersection point)
      if (Math.abs(dx) === 0) return [cy];
      
      // If vertical line passes through the circle but not through center, it's not a function (2 intersection points)
      const dy = Math.sqrt(radius * radius - dx * dx);
      return [cy - dy, cy + dy];
    }
  };