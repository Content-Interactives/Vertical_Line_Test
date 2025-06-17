// Centralized type definitions
export interface Point {
  x: number;
  y: number;
}

export interface GraphDimensions {
  width: number;
  height: number;
}

export interface VerticalLineTestState {
  verticalLineX: number;
  isActive: boolean;
  intersectionCount: number;
  isTestPassed: boolean;
  isTestFailed: boolean;
}

export interface Animation {
  key: string;
  label: string;
  draw: (
    ctx: CanvasRenderingContext2D,
    params: GraphDimensions & { verticalLineX?: number }
  ) => void;
  getIntersection?: (x: number, width: number, height: number) => number[];
}

export type FlexiState = 'confident' | 'worried' | 'excited';
