export const parabola90 = {
    key: 'parabola90',
    label: '90° Parabola',
    draw: (ctx: CanvasRenderingContext2D, { width, height }: { width: number; height: number }) => {
      ctx.beginPath();
      for (let y = 0; y <= height; y++) {
        const x = width / 2 + Math.pow((y - height / 2) / 40, 2) * 40;
        if (y === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'purple';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  };