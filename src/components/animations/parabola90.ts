import { drawVerticalLineTest, drawIntersectionDot } from './verticalLineTest';

export const parabola90 = {
    key: 'parabola90',
    label: '90° Parabola',
    draw: (
      ctx: CanvasRenderingContext2D,
      { width, height, verticalLineX }: { width: number; height: number; verticalLineX?: number }
    ) => {
      ctx.beginPath();
      for (let y = 0; y <= height; y++) {
        const x = width / 2 + Math.pow((y - height / 2) / 40, 2) * 40;
        if (y === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'purple';
      ctx.lineWidth = 2;
      ctx.stroke();

      if (verticalLineX !== undefined) {
        drawVerticalLineTest(ctx, verticalLineX, height);
        const ys = parabola90.getIntersection(verticalLineX, width, height);
        const isFailed = ys.length > 1; // 90° parabola fails vertical line test if more than 1 intersection
        
        ys.forEach(y => drawIntersectionDot(ctx, verticalLineX, y, 6, isFailed));
      }
    },
    getIntersection: (
      x: number,
      width: number,
      height: number
    ): number[] => {
      // x = width/2 + ((y - height/2)/40)^2 * 40
      // Solve for y: (x - width/2)/40 = t^2, so t = ±sqrt((x - width/2)/40)
      const cx = width / 2;
      const cy = height / 2;
      const t2 = (x - cx) / 40;
      
      // No intersection if vertical line is to the left of the parabola
      if (t2 < 0) return [];
      
      // If vertical line passes exactly through the vertex, it's a function (1 intersection point)
      if (t2 === 0) return [cy];
      
      // If vertical line passes through the parabola but not through vertex, it's not a function (2 intersection points)
      const t = Math.sqrt(t2);
      return [cy + t * 40, cy - t * 40];
    }
  };