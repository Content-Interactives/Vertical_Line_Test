import { Point } from '../types';
import { VERTICAL_LINE_TEST } from '../constants';

/**
 * Calculate intersection of vertical line with line segment
 */
export function getLineSegmentIntersection(
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

/**
 * Get all intersections of a drawn curve with vertical line
 */
export function getDrawnCurveIntersections(points: Point[], verticalLineX: number): number[] {
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
    const isDuplicate = filteredIntersections.some(
      existingY => Math.abs(existingY - y) < VERTICAL_LINE_TEST.INTERSECTION_TOLERANCE
    );
    if (!isDuplicate) {
      filteredIntersections.push(y);
    }
  });
  
  return filteredIntersections;
}

/**
 * Check if vertical line test passes for given intersection count
 */
export function isVerticalLineTestPassed(intersectionCount: number): boolean {
  return intersectionCount < VERTICAL_LINE_TEST.INTERSECTION_THRESHOLD;
}
