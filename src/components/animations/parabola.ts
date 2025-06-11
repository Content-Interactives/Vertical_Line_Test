export const parabola = {
    key: 'parabola',
    label: 'Parabola',
    draw: (ctx: CanvasRenderingContext2D, { width, height }: { width: number; height: number }) => {
      ctx.beginPath();
      for (let x = 0; x <= width; x++) {
        const y = height - Math.pow((x - width / 2) / 40, 2) * 40;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'green';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  };