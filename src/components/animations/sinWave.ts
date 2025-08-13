import { drawVerticalLineTest, drawIntersectionDot } from './verticalLineTest';

export const sinWave = {
    key: 'sinWave',
    label: 'Sin Wave',
    draw: (
      ctx: CanvasRenderingContext2D,
      { width, height, verticalLineX }: { width: number; height: number; verticalLineX?: number }
    ) => {
      ctx.beginPath();
      for (let x = 0; x <= width; x++) {
        const y = height / 2 - Math.sin((x / width) * 2 * Math.PI) * (height / 4);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'orange';
      ctx.lineWidth = 2;
      ctx.stroke();

      if (verticalLineX !== undefined) {
        drawVerticalLineTest(ctx, verticalLineX, height);
        const ys = sinWave.getIntersection(verticalLineX, width, height);
        const isFailed = ys.length > 1; // Sin wave is a function, so should never fail
        
        ys.forEach(y => drawIntersectionDot(ctx, verticalLineX, y, 6, isFailed));
      }
    },
    getIntersection: (
      x: number,
      width: number,
      height: number
    ): number[] => {
      // y = height/2 - sin((x/width)*2π) * (height/4)
      const y = height / 2 - Math.sin((x / width) * 2 * Math.PI) * (height / 4);
      return [y];
    }
  };

export const invertedSinWave = {
  key: 'invertedSinWave',
  label: 'Inverted Sin Wave',
  draw: (
    ctx: CanvasRenderingContext2D,
    { width, height, verticalLineX }: { width: number; height: number; verticalLineX?: number }
  ) => {
    ctx.beginPath();
    for (let x = 0; x <= width; x++) {
      const y = height / 2 + Math.sin((x / width) * 2 * Math.PI) * (height / 4);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = 'brown';
    ctx.lineWidth = 2;
    ctx.stroke();

    if (verticalLineX !== undefined) {
      drawVerticalLineTest(ctx, verticalLineX, height);
      const ys = invertedSinWave.getIntersection(verticalLineX, width, height);
      const isFailed = ys.length > 1; // Inverted sin wave is a function, so should never fail
      
      ys.forEach(y => drawIntersectionDot(ctx, verticalLineX, y, 6, isFailed));
    }
  },
  getIntersection: (
    x: number,
    width: number,
    height: number
  ): number[] => {
    // y = height/2 + sin((x/width)*2π) * (height/4)
    const y = height / 2 + Math.sin((x / width) * 2 * Math.PI) * (height / 4);
    return [y];
  }
};