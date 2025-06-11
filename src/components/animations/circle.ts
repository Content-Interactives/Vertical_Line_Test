export const circle = {
    key: 'circle',
    label: 'Circle',
    draw: (ctx: CanvasRenderingContext2D, { width, height }: { width: number; height: number }) => {
      const radius = Math.min(width, height) / 3;
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  };