import { FlexiState } from '../types';
import { FLEXI_STATES } from '../constants';

import FlexiConfident from '../../Ck12_Assets/Flexi_Confident.svg';
import FlexiWorried from '../../Ck12_Assets/Flexi_Worried.svg';
import FlexiExcited from '../../Ck12_Assets/Flexi_Excited.svg';

const FLEXI_IMAGES = {
  [FLEXI_STATES.CONFIDENT]: FlexiConfident,
  [FLEXI_STATES.WORRIED]: FlexiWorried,
  [FLEXI_STATES.EXCITED]: FlexiExcited,
};

/**
 * Determines the appropriate Flexi character state based on test conditions
 */
export function getFlexiState(isTestFailed: boolean, isTestPassed: boolean): FlexiState {
  if (isTestFailed) return FLEXI_STATES.WORRIED;
  if (isTestPassed) return FLEXI_STATES.EXCITED;
  return FLEXI_STATES.CONFIDENT;
}

/**
 * Gets the appropriate Flexi image based on state
 */
export function getFlexiImage(state: FlexiState): string {
  return FLEXI_IMAGES[state];
}

/**
 * Gets the appropriate speech text for Flexi
 */
export function getFlexiSpeechText(isTestFailed: boolean, isTestPassed: boolean): string {
  if (isTestFailed) return "Test failed. This is not a function.";
  if (isTestPassed) return "Test passed! This is a function.";
  return "Use the slider to perform the vertical line test.";
}
