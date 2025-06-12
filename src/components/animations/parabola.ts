import { drawVerticalLineTest, drawIntersectionDot } from './verticalLineTest';

export const parabola = {
    key: 'parabola',
    label: 'Parabola',
    draw: (
      ctx: CanvasRenderingContext2D,
      { width, height, verticalLineX }: { width: number; height: number; verticalLineX?: number }
    ) => {
      const h = width / 2;
      const k = height - 40;
      const a = -4 * (height - 40) / (width * width);

      ctx.beginPath();
      for (let x = 0; x <= width; x++) {
        const y = a * Math.pow(x - h, 2) + k;
        if (x === 0) ctx.moveTo(x, y);
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
      const h = width / 2;
      const k = height - 40;
      const a = -4 * (height - 40) / (width * width);
      const y = a * Math.pow(x - h, 2) + k;
      return [y];
    }
  };