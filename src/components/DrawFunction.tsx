import React, { useRef, useState } from 'react';
import { drawVerticalLineTest, drawIntersectionDot } from './animations/verticalLineTest';

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 500;

function drawArrow(ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number) {
  const headLength = 12; // length of the arrow head
  const dx = toX - fromX;
  const dy = toY - fromY;
  const angle = Math.atan2(dy, dx);

  // Draw the main line
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();

  // Draw the arrow head
  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(
    toX - headLength * Math.cos(angle - Math.PI / 6),
    toY - headLength * Math.sin(angle - Math.PI / 6)
  );
  ctx.lineTo(
    toX - headLength * Math.cos(angle + Math.PI / 6),
    toY - headLength * Math.sin(angle + Math.PI / 6)
  );
  ctx.lineTo(toX, toY);
  ctx.lineTo(
    toX - headLength * Math.cos(angle - Math.PI / 6),
    toY - headLength * Math.sin(angle - Math.PI / 6)
  );
  ctx.stroke();
}

function drawAxes(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.globalAlpha = 1;

  // X axis (horizontal, full width)
  drawArrow(ctx, 0, height / 2, width, height / 2); // right
  drawArrow(ctx, width, height / 2, 0, height / 2); // left

  // Y axis (vertical, full height)
  drawArrow(ctx, width / 2, height, width / 2, 0); // up
  drawArrow(ctx, width / 2, 0, width / 2, height); // down
}

// Function to find intersection of vertical line with line segment
function getLineSegmentIntersection(
  x1: number, y1: number, x2: number, y2: number, 
  verticalLineX: number
): number | null {
  // If both points are on the same side of the vertical line, no intersection
  if ((x1 < verticalLineX && x2 < verticalLineX) || (x1 > verticalLineX && x2 > verticalLineX)) {
    return null;
  }
  
  // If the line segment is vertical and matches our vertical line
  if (x1 === x2 && x1 === verticalLineX) {
    return y1; // Return one of the y values
  }
  
  // If the line segment is vertical but doesn't match our vertical line
  if (x1 === x2) {
    return null;
  }
  
  // Calculate intersection using linear interpolation
  const t = (verticalLineX - x1) / (x2 - x1);
  if (t >= 0 && t <= 1) {
    return y1 + t * (y2 - y1);
  }
  
  return null;
}

// Function to get all intersections of the drawn curve with vertical line
function getDrawnCurveIntersections(points: {x: number, y: number}[], verticalLineX: number): number[] {
  const intersections: number[] = [];
  
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    
    const intersectionY = getLineSegmentIntersection(p1.x, p1.y, p2.x, p2.y, verticalLineX);
    if (intersectionY !== null) {
      intersections.push(intersectionY);
    }
  }
  
  // Remove duplicate intersections that are very close to each other
  const filteredIntersections: number[] = [];
  intersections.forEach(y => {
    const isDuplicate = filteredIntersections.some(existingY => Math.abs(existingY - y) < 3);
    if (!isDuplicate) {
      filteredIntersections.push(y);
    }
  });
  
  return filteredIntersections;
}

interface DrawFunctionProps {
  verticalLineX?: number;
  onIntersectionChange?: (intersectionCount: number) => void;
}

export default function DrawFunction({ verticalLineX = 0, onIntersectionChange }: DrawFunctionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);

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

    // Draw the coordinate axes first (in the background)
    drawAxes(ctx, CANVAS_WIDTH, CANVAS_HEIGHT);

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

    // Draw the vertical line using the standard function
    drawVerticalLineTest(ctx, verticalLineX, CANVAS_HEIGHT);

    // Calculate and draw intersection dots using proper line segment intersection
    if (points.length > 1) {
      const intersectionYs = getDrawnCurveIntersections(points, verticalLineX);
      intersectionYs.forEach(y => {
        drawIntersectionDot(ctx, verticalLineX, y);
      });
      
      // Notify parent component about intersection count
      if (onIntersectionChange) {
        onIntersectionChange(intersectionYs.length);
      }
    }
  }, [points, verticalLineX, onIntersectionChange]);

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
    </div>
  );
}
