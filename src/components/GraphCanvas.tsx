import React, { useEffect, useRef } from 'react';
import { allAnimations } from './animations';
import { drawVerticalLineTest, drawIntersectionDot } from './animations/verticalLineTest';

interface GraphCanvasProps {
  width?: number;
  height?: number;
  selectedAnimation: string;
  verticalLineTestActive?: boolean;
  verticalLineX?: number;
}

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
  ctx.clearRect(0, 0, width, height);
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

// Main drawing logic
function drawGraph(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  selectedAnimation: string,
  verticalLineTestActive?: boolean,
  verticalLineX?: number
) {
  drawAxes(ctx, width, height);
  const selectedAnim = allAnimations.find(anim => anim.key === selectedAnimation);
  if (selectedAnim) {
    selectedAnim.draw(ctx, {
      width,
      height,
      verticalLineX: verticalLineTestActive ? verticalLineX : undefined,
    });
    if (verticalLineX !== undefined) {
      drawVerticalLineTest(ctx, verticalLineX, height);

      // Get the intersection y for the selected animation
      if (selectedAnim && selectedAnim.getIntersection && verticalLineX !== undefined) {
        const ys = selectedAnim.getIntersection(verticalLineX, width, height);
        ys.forEach(y => drawIntersectionDot(ctx, verticalLineX, y));
      }
    }
  }
}

const GraphCanvas: React.FC<GraphCanvasProps> = ({
  width = 500,
  height = 500,
  selectedAnimation,
  verticalLineTestActive = false,
  verticalLineX,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawGraph(ctx, width, height, selectedAnimation, verticalLineTestActive, verticalLineX);
  }, [selectedAnimation, width, height, verticalLineTestActive, verticalLineX]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          border: '1px solid #ccc',
          backgroundColor: 'white',
        }}
      />
    </div>
  );
};

export default GraphCanvas; 