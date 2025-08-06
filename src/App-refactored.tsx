import React, { useState, useEffect } from 'react';
import './App.css';
import GraphCanvas from './components/GraphCanvas';
import AnimationMenu from './components/AnimationMenu';
import FlexiController from './components/FlexiController';
import DrawFunction from './components/DrawFunction';
import { allAnimations } from './components/animations';
import { useVerticalLineTest } from './hooks/useVerticalLineTest';
import { getFlexiState, getFlexiImage } from './utils/flexiUtils';
import { CANVAS_DIMENSIONS } from './constants';

// Import Flexi images directly for now (until we fix the utils)
import FlexiConfident from '../Ck12_Assets/Flexi_Confident.svg';
import FlexiWorried from '../Ck12_Assets/Flexi_Worried.svg';
import FlexiExcited from '../Ck12_Assets/Flexi_Excited.svg';

function GraphTitle() {
  return (
    <div style={{
      position: 'absolute',
      top: -50,
      left: '50%',
      transform: 'translateX(-50%)',
      fontSize: '3.5vw',
      fontWeight: 600,
      color: '#2e7d32',
      zIndex: 10,
      pointerEvents: 'none'
    }}>
      Vertical Line Test
    </div>
  );
}

function App() {
  const [selectedAnimation, setSelectedAnimation] = useState('line');
  const {
    state: verticalLineTestState,
    isSliderDisabled,
    updateVerticalLinePosition,
    updateIntersectionCount,
    reset,
  } = useVerticalLineTest();

  // Handle slider changes
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newX = Number(e.target.value);
    updateVerticalLinePosition(newX);

    // For draw mode, intersection logic is handled by DrawFunction component
    if (selectedAnimation === 'draw') {
      return;
    }

    // For pre-built animations, calculate intersections
    const selectedAnim = allAnimations.find(anim => anim.key === selectedAnimation);
    if (selectedAnim && selectedAnim.getIntersection) {
      const ys = selectedAnim.getIntersection(newX, CANVAS_DIMENSIONS.WIDTH, CANVAS_DIMENSIONS.HEIGHT);
      updateIntersectionCount(ys.length);
    }
  };

  // Handle intersection changes from DrawFunction
  const handleDrawIntersectionChange = (intersectionCount: number) => {
    updateIntersectionCount(intersectionCount);
  };

  // Reset when animation changes
  useEffect(() => {
    reset();
  }, [selectedAnimation, reset]);

  // Get appropriate Flexi image
  const flexiState = getFlexiState(verticalLineTestState.isTestFailed, verticalLineTestState.isTestPassed);
  const flexiImages = {
    confident: FlexiConfident,
    worried: FlexiWorried,
    excited: FlexiExcited,
  };
  const flexiImg = flexiImages[flexiState];

  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'row', minHeight: '100vh' }}>
      <AnimationMenu
        selected={selectedAnimation}
        onSelect={setSelectedAnimation}
      />
      <div style={{ flex: 1 }}>
        <header className="App-header">
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: CANVAS_DIMENSIONS.HEIGHT,
            position: 'relative'
          }}>
            <GraphTitle />
            {selectedAnimation === 'draw' ? (
              <DrawFunction 
                verticalLineX={verticalLineTestState.verticalLineX} 
                onIntersectionChange={handleDrawIntersectionChange}
              />
            ) : (
              <GraphCanvas
                width={CANVAS_DIMENSIONS.WIDTH}
                height={CANVAS_DIMENSIONS.HEIGHT}
                selectedAnimation={selectedAnimation}
                verticalLineX={verticalLineTestState.verticalLineX}
                verticalLineTestActive={verticalLineTestState.isActive}
              />
            )}
          </div>
          <FlexiController
            flexiImg={flexiImg}
            verticalLineX={verticalLineTestState.verticalLineX}
            handleSliderChange={handleSliderChange}
            sliderDisabled={isSliderDisabled}
            isTestPassed={verticalLineTestState.isTestPassed}
            isTestFailed={verticalLineTestState.isTestFailed}
            maxValue={CANVAS_DIMENSIONS.WIDTH}
          />
        </header>
      </div>
    </div>
  );
}

export default App;
