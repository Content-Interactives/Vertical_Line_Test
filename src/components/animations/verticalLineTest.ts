// src/components/animations/verticalLineTest.ts

export function animateVerticalLineTest(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  drawGraph: (ctx: CanvasRenderingContext2D) => void,
  onComplete?: () => void
) {
  let x = 0;
  function animate() {
    ctx.clearRect(0, 0, width, height);
    drawGraph(ctx);
    // Draw vertical line
    ctx.save();
    ctx.strokeStyle = 'red';
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
    ctx.restore();

    x += 2;
    if (x <= width) {
      requestAnimationFrame(animate);
    } else if (onComplete) {
      onComplete();
    }
  }
  animate();
}

export function drawVerticalLineTest(ctx: CanvasRenderingContext2D, x: number, height: number, color: string = 'rgba(255,0,0,0.7)') {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 6]);
  ctx.beginPath();
  ctx.moveTo(x, 0);
  ctx.lineTo(x, height);
  ctx.stroke();
  ctx.restore();
}