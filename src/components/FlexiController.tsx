import React from 'react';
import { getFlexiSpeechText } from '../utils/flexiUtils';

interface FlexiControllerProps {
  flexiImg: string;
  verticalLineX: number;
  handleSliderChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  sliderDisabled: boolean;
  isTestPassed: boolean;
  isTestFailed: boolean;
  maxValue?: number;
}

/**
 * Component that handles the Flexi character, slider, and test feedback
 */
export default function FlexiController({
  flexiImg,
  verticalLineX,
  handleSliderChange,
  sliderDisabled,
  isTestPassed,
  isTestFailed,
  maxValue = 500,
}: FlexiControllerProps) {
  const speechText = getFlexiSpeechText(isTestFailed, isTestPassed);

  return (
    <div style={{ width: maxValue, display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '20px 0' }}>
      <input
        type="range"
        min={0}
        max={maxValue}
        value={verticalLineX}
        onChange={handleSliderChange}
        style={{ width: '100%' }}
        disabled={sliderDisabled}
      />
      <div style={{ width: maxValue, display: 'flex', alignItems: 'flex-end', marginTop: 16 }}>
        <img src={flexiImg} alt="Flexi" style={{ width: '10vw', height: '10vw' }} />
        <div className="speech-bubble" style={{ marginLeft: '2vw', marginBottom: '1vh', marginRight: 'auto' }}>
          {speechText}
        </div>
      </div>
      {isTestFailed}
    </div>
  );
}
