import React, { useEffect, useRef, useCallback, useState } from 'react';

interface GraphCanvasProps {
  width?: number;
  height?: number;
  onAnimationComplete?: () => void;
  onAnimationStart?: () => void;
}

// Animation constants
const ANIMATION_SPEED = 2; // pixels per frame
const FADE_FRAMES = 30; // Approx 0.5s at 60fps
const PADDING = 80; // pixels of padding from canvas edges

// Animation state type for better type safety
type AnimationPhase = 'IDLE' | 'FADING_IN' | 'MOVING' | 'FADING_OUT' | 'PARABOLA_FADING_IN';

// Interface for animation elements to make it easy to add new ones
interface AnimationElement {
  draw: (ctx: CanvasRenderingContext2D, alpha: number) => void;
  update?: () => void;
}

const GraphCanvas: React.FC<GraphCanvasProps> = ({ 
  width = 500, 
  height = 500,
  onAnimationComplete,
  onAnimationStart
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const currentXRef = useRef<number>(0);
  const fadeFrameCountRef = useRef<number>(0);
  const animationPhaseRef = useRef<AnimationPhase>('IDLE');
  const currentAlphaRef = useRef<number>(0);
  const fadeOutRef = useRef<boolean>(false);

  const [isAnimating, setIsAnimating] = useState(false);

  // Constants for the coordinate system
  const ORIGIN_X = width / 2;
  const ORIGIN_Y = height / 2;
  const SCALE = 40; // pixels per unit

  const drawArrow = useCallback((ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number) => {
    const headLength = 10;
    const angle = Math.atan2(toY - fromY, toX - fromX);

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
    ctx.closePath();
    ctx.fill();
  }, []);

  const drawLineYEqualsX = useCallback((ctx: CanvasRenderingContext2D, alpha: number = 1) => {
    // Calculate the points for y=x line with padding
    const startX = PADDING;
    const endX = width - PADDING;
    const startY = height - PADDING;
    const endY = PADDING;
    
    ctx.save();
    ctx.globalAlpha = alpha;
    
    ctx.strokeStyle = '#0000FF';
    ctx.fillStyle = '#0000FF';
    ctx.lineWidth = 2;
    
    // Draw the line with arrows
    drawArrow(ctx, startX, startY, endX, endY);
    drawArrow(ctx, endX, endY, startX, startY);
    
    ctx.restore();
  }, [width, height, drawArrow]);

  const drawVerticalLine = useCallback((ctx: CanvasRenderingContext2D, x: number, alpha: number) => {
    ctx.save();
    ctx.globalAlpha = alpha;
    
    ctx.strokeStyle = '#FF0000';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 5]);
    
    ctx.beginPath();
    ctx.moveTo(x, PADDING);
    ctx.lineTo(x, height - PADDING);
    ctx.stroke();
    
    ctx.restore();
  }, [height]);

  const drawIntersectionPoint = useCallback((ctx: CanvasRenderingContext2D, x: number, alpha: number) => {
    ctx.save();
    ctx.globalAlpha = alpha;

    const xRelativeToOrigin = (x - ORIGIN_X) / SCALE;
    const yRelativeToOrigin = xRelativeToOrigin;
    const intersectionY = ORIGIN_Y - yRelativeToOrigin * SCALE;
    
    ctx.beginPath();
    ctx.arc(x, intersectionY, 5, 0, 2 * Math.PI);
    ctx.fillStyle = '#00FF00';
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();
  }, [ORIGIN_X, ORIGIN_Y, SCALE]);

  const drawAxes = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, width, height);
    
    ctx.strokeStyle = '#000';
    ctx.fillStyle = '#000';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 1;
    
    // Draw x-axis with padding
    drawArrow(ctx, PADDING, ORIGIN_Y, width - PADDING, ORIGIN_Y);
    drawArrow(ctx, width - PADDING, ORIGIN_Y, PADDING, ORIGIN_Y);
    
    // Draw y-axis with padding
    drawArrow(ctx, ORIGIN_X, height - PADDING, ORIGIN_X, PADDING);
    drawArrow(ctx, ORIGIN_X, PADDING, ORIGIN_X, height - PADDING);
  }, [width, height, drawArrow, ORIGIN_X, ORIGIN_Y]);

  // Create animation elements array for easy management
  const getAnimationElements = useCallback((): AnimationElement[] => {
    return [
      {
        // Linear function is always visible (alpha = 1)
        draw: (ctx) => {
          drawLineYEqualsX(ctx, 1);
        }
      },
      {
        // Vertical line and intersection point fade in and out
        draw: (ctx, alpha) => {
          if (animationPhaseRef.current !== 'IDLE' && animationPhaseRef.current !== 'PARABOLA_FADING_IN') {
            drawVerticalLine(ctx, currentXRef.current, alpha);
            drawIntersectionPoint(ctx, currentXRef.current, alpha);
          }
        },
        update: () => {
          if (animationPhaseRef.current === 'MOVING') {
            currentXRef.current += ANIMATION_SPEED;
            if (currentXRef.current >= width - PADDING) {
              currentXRef.current = width - PADDING;
              animationPhaseRef.current = 'FADING_OUT';
            }
          }
        }
      },
      
    ];
  }, [drawLineYEqualsX, drawVerticalLine, drawIntersectionPoint, width]);

  const stopAnimation = useCallback(() => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setIsAnimating(false);
    animationPhaseRef.current = 'IDLE';
    currentXRef.current = PADDING;
    currentAlphaRef.current = 0;
    fadeFrameCountRef.current = 0;
    fadeOutRef.current = false;
  }, []);

  const drawFrame = useCallback((ctx: CanvasRenderingContext2D) => {
    drawAxes(ctx);
    
    // Always draw the linear function with full opacity
    getAnimationElements()[0].draw(ctx, 1);
    
    if (animationPhaseRef.current !== 'IDLE') {
      const alpha = fadeOutRef.current ? 
        Math.max(0, currentAlphaRef.current - 0.05) : 
        currentAlphaRef.current;
      
      currentAlphaRef.current = alpha;
      
      // Draw all animation elements with appropriate alpha
      getAnimationElements().forEach(element => {
        element.draw(ctx, alpha);
      });
      
      if (fadeOutRef.current && alpha <= 0) {
        stopAnimation();
      }
    }
  }, [drawAxes, getAnimationElements, stopAnimation]);

  const startAnimation = useCallback(() => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    currentXRef.current = PADDING;
    currentAlphaRef.current = 0;
    fadeFrameCountRef.current = 0;
    fadeOutRef.current = false;
    animationPhaseRef.current = 'FADING_IN';
    
    if (onAnimationStart) {
      onAnimationStart();
    }
    
    const animate = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let continueAnimation = true;

      switch (animationPhaseRef.current) {
        case 'FADING_IN':
          fadeFrameCountRef.current++;
          currentAlphaRef.current = Math.min(1, fadeFrameCountRef.current / FADE_FRAMES);
          
          if (fadeFrameCountRef.current >= FADE_FRAMES) {
            animationPhaseRef.current = 'MOVING';
            fadeFrameCountRef.current = 0;
            currentAlphaRef.current = 1;
          }
          break;

        case 'MOVING':
          // Update all animation elements
          getAnimationElements().forEach(element => {
            if (element.update) element.update();
          });
          
          if (currentXRef.current >= width - PADDING) {
            currentXRef.current = width - PADDING;
            animationPhaseRef.current = 'FADING_OUT';
          }
          break;

        case 'FADING_OUT':
          fadeFrameCountRef.current++;
          currentAlphaRef.current = Math.max(0, 1 - (fadeFrameCountRef.current / FADE_FRAMES));
          
          if (fadeFrameCountRef.current >= FADE_FRAMES) {
            currentAlphaRef.current = 0;
            fadeFrameCountRef.current = 0;
            animationPhaseRef.current = 'PARABOLA_FADING_IN';
            currentAlphaRef.current = 0;
          }
          break;

        case 'PARABOLA_FADING_IN':
          fadeFrameCountRef.current++;
          currentAlphaRef.current = Math.min(1, fadeFrameCountRef.current / FADE_FRAMES);
          
          if (fadeFrameCountRef.current >= FADE_FRAMES) {
            currentAlphaRef.current = 1;
            setIsAnimating(false);
            animationPhaseRef.current = 'IDLE';
            fadeFrameCountRef.current = 0;
            currentXRef.current = PADDING;
            continueAnimation = false;
            
            if (onAnimationComplete) {
              onAnimationComplete();
            }
          }
          break;
          
        default:
          continueAnimation = false;
          break;
      }

      drawFrame(ctx);

      if (continueAnimation) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        animationRef.current = null;
      }
    };
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    animationRef.current = requestAnimationFrame(animate);
  }, [isAnimating, width, drawFrame, onAnimationComplete, onAnimationStart, getAnimationElements]);

  // Function to start the fade-out effect
  const startFadeOut = useCallback(() => {
    fadeOutRef.current = true;
  }, []);

  // Expose the startFadeOut function to the parent component
  useEffect(() => {
    if (onAnimationComplete) {
      // We'll use a custom event to communicate with the parent
      const handleFadeOut = () => {
        startFadeOut();
      };
      
      window.addEventListener('startFadeOut', handleFadeOut);
      
      return () => {
        window.removeEventListener('startFadeOut', handleFadeOut);
      };
    }
  }, [onAnimationComplete, startFadeOut]);

  // Initial draw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawAxes(ctx);
    drawLineYEqualsX(ctx, 1);
    
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [drawAxes, drawLineYEqualsX]);

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
      <div style={{ marginTop: '10px', textAlign: 'center' }}>
        <button 
          onClick={isAnimating ? stopAnimation : startAnimation}
          style={{
            padding: '8px 16px',
            backgroundColor: isAnimating ? '#ff6b6b' : '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          {isAnimating ? 'Stop Animation' : 'Start Animation'}
        </button>
      </div>
    </div>
  );
};

export default GraphCanvas; 