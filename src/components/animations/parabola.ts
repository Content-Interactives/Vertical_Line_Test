import { drawVerticalLineTest, drawIntersectionDot } from './verticalLineTest';

export const parabola = {
    key: 'parabola',
    label: 'Parabola',
    draw: (
      ctx: CanvasRenderingContext2D,
      { width, height, verticalLineX }: { width: number; height: number; verticalLineX?: number }
    ) => {
      ctx.beginPath();
      for (let x = 0; x <= width; x++) {
        const y = height - Math.pow((x - width / 2) / 40, 2) * 40;
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
      // y = height - ((x - width/2)/40)^2 * 40
      const y = height - Math.pow((x - width / 2) / 40, 2) * 40;
      return [y];
    }
  };