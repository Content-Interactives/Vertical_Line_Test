import { line } from './line';
import { circle } from './circle';
import { parabola } from './parabola';
import { parabola90 } from './parabola90';
import { sinWave } from './sinWave';
import { invertedSinWave } from './invertedSinWave';

export interface Animation {
  key: string;
  label: string;
  draw: (
    ctx: CanvasRenderingContext2D,
    params: { width: number; height: number; verticalLineX?: number }
  ) => void;
  getIntersection?: (x: number, width: number, height: number) => number[];
}

export const allAnimations: Animation[] = [
  line,
  circle,
  parabola,
  parabola90,
  sinWave,
  invertedSinWave,
];

export { line } from './line';
export { circle } from './circle';
export { parabola } from './parabola';
export { parabola90 } from './parabola90';
export { sinWave } from './sinWave';
export { invertedSinWave } from './invertedSinWave';