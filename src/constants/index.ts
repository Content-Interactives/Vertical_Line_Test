// Centralized constants
export const CANVAS_DIMENSIONS = {
  WIDTH: 500,
  HEIGHT: 500,
} as const;

export const VERTICAL_LINE_TEST = {
  INTERSECTION_THRESHOLD: 2,
  INTERSECTION_TOLERANCE: 3, // pixels
  LINE_DETECTION_DELTA: 2,
} as const;

export const FLEXI_STATES = {
  CONFIDENT: 'confident',
  WORRIED: 'worried', 
  EXCITED: 'excited',
} as const;
