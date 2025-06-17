import React, { useRef, useState } from 'react';

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 500;

export default function DrawFunction() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  const [verticalLineX, setVerticalLineX] = useState(0);

  // Start drawing
  const handleMouseDown = (e: React.MouseEvent) => {
    setDrawing(true);
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    setPoints([{ x: e.clientX - rect.left, y: e.clientY - rect.top }]);
  };

  // Draw as mouse moves
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!drawing) return;
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    setPoints((prev) => [
      ...prev,
      { x: e.clientX - rect.left, y: e.clientY - rect.top },
    ]);
  };

  // Stop drawing
  const handleMouseUp = () => setDrawing(false);

  // Draw the curve and vertical line
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw the user's curve
    if (points.length > 1) {
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.strokeStyle = '#ff9800';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Draw the vertical line
    ctx.save();
    ctx.strokeStyle = 'red';
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.moveTo(verticalLineX, 0);
    ctx.lineTo(verticalLineX, CANVAS_HEIGHT);
    ctx.stroke();
    ctx.restore();

    // Draw intersection dot(s)
    const delta = 2;
    const intersectingPoints = points.filter(
      pt => Math.abs(pt.x - verticalLineX) < delta
    );
    intersectingPoints.forEach(pt => {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 6, 0, 2 * Math.PI);
      ctx.fillStyle = 'lime';
      ctx.strokeStyle = 'purple';
      ctx.lineWidth = 3;
      ctx.fill();
      ctx.stroke();
    });
  }, [points, verticalLineX]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        style={{ border: '1px solid #ccc', background: 'white' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
      <input
        type="range"
        min={0}
        max={CANVAS_WIDTH}
        value={verticalLineX}
        onChange={e => setVerticalLineX(Number(e.target.value))}
        style={{ width: CANVAS_WIDTH, marginTop: 16 }}
      />
    </div>
  );
}
