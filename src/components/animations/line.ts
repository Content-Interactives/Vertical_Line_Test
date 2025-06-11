import { drawVerticalLineTest } from './verticalLineTest';

export const line = {
    key: 'line',
    label: 'Line',
    draw: (ctx: CanvasRenderingContext2D, { width, height, verticalLineX }: { width: number; height: number; verticalLineX?: number }) => {
      // Draw y = x
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(width, 0);
      ctx.strokeStyle = 'blue';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw vertical line test if requested
      if (verticalLineX !== undefined) {
        drawVerticalLineTest(ctx, verticalLineX, height);
      }
    },
    getIntersection: (x: number, width: number, height: number): number[] => {
      // For y = x, intersection is at y = height - x (canvas coordinates)
      return [height - x];
    }
  };
