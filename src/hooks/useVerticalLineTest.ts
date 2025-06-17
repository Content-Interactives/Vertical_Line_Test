import { useState } from 'react';
import { VerticalLineTestState } from '../types';
import { VERTICAL_LINE_TEST, CANVAS_DIMENSIONS } from '../constants';

/**
 * Custom hook to manage vertical line test state and logic
 */
export function useVerticalLineTest() {
  const [verticalLineX, setVerticalLineX] = useState(0);
  const [intersectionCount, setIntersectionCount] = useState(0);
  
  const isTestFailed = intersectionCount >= VERTICAL_LINE_TEST.INTERSECTION_THRESHOLD;
  const isTestPassed = verticalLineX === CANVAS_DIMENSIONS.WIDTH && intersectionCount < VERTICAL_LINE_TEST.INTERSECTION_THRESHOLD;
  const isSliderDisabled = isTestFailed;

  const state: VerticalLineTestState = {
    verticalLineX,
    isActive: true,
    intersectionCount,
    isTestPassed,
    isTestFailed,
  };

  const updateVerticalLinePosition = (newX: number) => {
    setVerticalLineX(newX);
  };

  const updateIntersectionCount = (count: number) => {
    setIntersectionCount(count);
  };

  const reset = () => {
    setVerticalLineX(0);
    setIntersectionCount(0);
  };

  return {
    state,
    isSliderDisabled,
    updateVerticalLinePosition,
    updateIntersectionCount,
    reset,
  };
}
