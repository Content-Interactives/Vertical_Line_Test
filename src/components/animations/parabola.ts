import { drawVerticalLineTest, drawIntersectionDot } from './verticalLineTest';

export const parabola = {
    key: 'parabola',
    label: 'Parabola',
    draw: (
      ctx: CanvasRenderingContext2D,
      { width, height, verticalLineX }: { width: number; height: number; verticalLineX?: number }
    ) => {
      const padding = 40;
      const h = width / 2;
      const k = height - padding;
      const a = -(height - 2 * padding) / Math.pow(h - padding, 2);

      ctx.beginPath();
      for (let x = padding; x <= width - padding; x++) {
        const y = a * Math.pow(x - h, 2) + k;
        if (x === padding) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'green';
      ctx.lineWidth = 2;
      ctx.stroke();

      if (verticalLineX !== undefined) {
        drawVerticalLineTest(ctx, verticalLineX, height);
        const ys = parabola.getIntersection(verticalLineX, width, height);
        ys.forEach(y => drawIntersectionDot(ctx, verticalLineX, y));
      }
    },
    getIntersection: (
      x: number,
      width: number,
      height: number
    ): number[] => {
      const padding = 40;
      const h = width / 2;
      const k = height - padding;
      const a = -(height - 2 * padding) / Math.pow(h - padding, 2);
      const y = a * Math.pow(x - h, 2) + k;
      return [y];
    }
  };