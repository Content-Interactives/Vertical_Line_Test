export const sinWave = {
    key: 'sinWave',
    label: 'Sin Wave',
    draw: (ctx: CanvasRenderingContext2D, { width, height }: { width: number; height: number }) => {
      ctx.beginPath();
      for (let x = 0; x <= width; x++) {
        const y = height / 2 - Math.sin((x / width) * 2 * Math.PI) * (height / 4);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'orange';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  };