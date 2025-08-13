import React, { useRef, useState, useEffect } from 'react';
import { drawVerticalLineTest, drawIntersectionDot } from './animations/verticalLineTest';
import { getDrawnCurveIntersections } from '../utils/intersectionUtils';
import { Point, GraphDimensions } from '../types';
import { CANVAS_DIMENSIONS } from '../constants';

interface DrawFunctionProps {
  verticalLineX?: number;
  onIntersectionChange?: (intersectionCount: number) => void;
  dimensions?: GraphDimensions;
}

export default function DrawFunction({ 
  verticalLineX = 0, 
  onIntersectionChange,
  dimensions = { width: CANVAS_DIMENSIONS.WIDTH, height: CANVAS_DIMENSIONS.HEIGHT }
}: DrawFunctionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [points, setPoints] = useState<Point[]>([]);

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setDrawing(true);
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    setPoints([{ x: e.clientX - rect.left, y: e.clientY - rect.top }]);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!drawing) return;
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    setPoints((prev) => [
      ...prev,
      { x: e.clientX - rect.left, y: e.clientY - rect.top },
    ]);
  };

  const handleMouseUp = () => setDrawing(false);

  // Drawing effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

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

    // Draw vertical line using standard function
    drawVerticalLineTest(ctx, verticalLineX, dimensions.height);

    // Calculate and draw intersection dots
    if (points.length > 1) {
      const intersectionYs = getDrawnCurveIntersections(points, verticalLineX);
      const isFailed = intersectionYs.length > 1; // Vertical line test fails if more than 1 intersection
      
      intersectionYs.forEach(y => {
        drawIntersectionDot(ctx, verticalLineX, y, 6, isFailed);
      });
      
      // Notify parent about intersection count
      if (onIntersectionChange) {
        onIntersectionChange(intersectionYs.length);
      }
    }
  }, [points, verticalLineX, onIntersectionChange, dimensions]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        style={{ border: '1px solid #ccc', background: 'white' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </div>
  );
}
