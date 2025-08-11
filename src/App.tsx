import React, { useState, useEffect } from 'react';
import './App.css';
import GraphCanvas from './components/GraphCanvas';
import AnimationMenu from './components/AnimationMenu';
import { allAnimations } from './components/animations';
import FlexiConfident from '../Ck12_Assets/Flexi_Confident.svg';
import FlexiWorried from '../Ck12_Assets/Flexi_Worried.svg';
import FlexiExcited from '../Ck12_Assets/Flexi_Excited.svg';
import DrawFunction from './components/DrawFunction';

function getFlexiImage({
  sliderDisabled,
  isAtEnd,
  FlexiConfident,
  FlexiWorried,
  FlexiExcited,
}: {
  sliderDisabled: boolean;
  isAtEnd: boolean;
  FlexiConfident: string;
  FlexiWorried: string;
  FlexiExcited: string;
}) {
  if (sliderDisabled) return FlexiWorried;
  if (isAtEnd) return FlexiExcited;
  return FlexiConfident;
}

type FlexiSliderRowProps = {
  flexiImg: string;
  verticalLineX: number;
  handleSliderChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  sliderDisabled: boolean;
  isDrawMode: boolean;
  // Remove these props - we don't need them anymore
  // hasDrawing: boolean;
  // isActivelyDrawing: boolean;
};

function FlexiSliderColumn({ flexiImg, verticalLineX, handleSliderChange, sliderDisabled, isDrawMode }: FlexiSliderRowProps) {
  let speechText = "Checking..";
  
  if (isDrawMode) {
    // Remove hasDrawing and isActivelyDrawing checks
    speechText = "Draw your graph!";
  } else {
    if (sliderDisabled) {
      speechText = "Fail!";
    } else if (verticalLineX === 500) {
      speechText = "Pass!";
    }
  }

  return (
          <div style={{ width: '60vw', display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '2vh 0' }}>
      <input
        type="range"
        min={0}
        max={500}
        value={verticalLineX}
        onChange={handleSliderChange}
        style={{ width: '100%', cursor: 'pointer' }}
        disabled={sliderDisabled}
      />
      <div style={{ width: '60vw', display: 'flex', alignItems: 'flex-end', marginTop: '2vh' }}>
        <img src={flexiImg} alt="Flexi" style={{ width: '10vw', height: '10vw' }} />
        <div className="speech-bubble" style={{ marginLeft: '2vw', marginBottom: '1vh' }}>
          {speechText}
        </div>
      </div>
    </div>
  );
}

function GraphTitle() {
  return (
    <div style={{
      textAlign: 'center',
      fontSize: '3.5vw',
      fontWeight: 600,
      color: '#2e7d32',
      marginBottom: '2vh',
      pointerEvents: 'none'
    }}>
      Vertical Line Test
    </div>
  );
}

function App() {
  const [showTitle, setShowTitle] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [selectedAnimation, setSelectedAnimation] = useState('line');
  const [verticalLineX, setVerticalLineX] = useState(0); // default to center
  const [sliderDisabled, setSliderDisabled] = useState(false);
  // Remove these drawing state variables - we don't need them anymore
  // const [hasDrawing, setHasDrawing] = useState(false);
  // const [isActivelyDrawing, setIsActivelyDrawing] = useState(false);
  
  // Stable canvas size to prevent mobile viewport change resets
  const [canvasSize, setCanvasSize] = useState(() => Math.min(window.innerWidth * 0.6, window.innerHeight * 0.6));
  
  // Only update canvas size on intentional resize, not mobile browser events
  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      // Debounce resize events to avoid mobile browser chrome showing/hiding
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const newSize = Math.min(window.innerWidth * 0.6, window.innerHeight * 0.6);
        // Only update if the change is significant (more than 50px) to avoid mobile browser UI changes
        if (Math.abs(newSize - canvasSize) > 50) {
          setCanvasSize(newSize);
        }
      }, 300);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [canvasSize]);

  const handleAnimationComplete = () => {
    setShowTitle(true);
    
    // After the title fades in, wait 1 second, then start the fade out
    setTimeout(() => {
      setFadeOut(true);
    }, 1000);
  };

  // Reset the fade states when the animation is restarted
  const handleAnimationStart = () => {
    setShowTitle(false);
    setFadeOut(false);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newX = Number(e.target.value);
    setVerticalLineX(newX);

    // If user moves slider, clear any previous failed state (manual reset)
    if (sliderDisabled) {
      setSliderDisabled(false);
    }

    // For draw mode, calculate intersections based on current drawing
    if (selectedAnimation === 'draw') {
      // The intersection calculation will happen in the useEffect of DrawFunction
      // which automatically calls onIntersectionChange
      return;
    }

    // For pre-built animations, calculate intersections
    const selectedAnim = allAnimations.find(anim => anim.key === selectedAnimation);
    if (selectedAnim && selectedAnim.getIntersection) {
      const ys = selectedAnim.getIntersection(newX, canvasSize, canvasSize);
      setSliderDisabled(ys.length >= 2);
    }
  };

  const handleDrawIntersectionChange = (intersectionCount: number) => {
    setSliderDisabled(intersectionCount >= 2);
  };

  // Remove this function - we don't need it anymore
  // const handleDrawingStateChange = (hasDrawingState: boolean, isActivelyDrawingState: boolean) => {
  //   setHasDrawing(hasDrawingState);
  //   setIsActivelyDrawing(isActivelyDrawingState);
  // };

  useEffect(() => {
    // Only reset slider state when changing animations
    if (selectedAnimation === 'draw') {
      // Don't reset slider position - let user see where they left off
      setSliderDisabled(false); // Reset failed state when switching to draw mode
    }
  }, [selectedAnimation]);

  const isAtEnd = verticalLineX === 500;
  const flexiImg = getFlexiImage({
    sliderDisabled,
    isAtEnd,
    FlexiConfident,
    FlexiWorried,
    FlexiExcited
  });

  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'row', minHeight: '100vh' }}>
      <AnimationMenu
        selected={selectedAnimation}
        onSelect={setSelectedAnimation}
      />
      <div style={{ flex: 1 }}>
        <header className="App-header">
          <GraphTitle />
          <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '60vh',
            position: 'relative'
          }}>
            {selectedAnimation === 'draw' ? (
              <DrawFunction 
                verticalLineX={verticalLineX} 
                onIntersectionChange={handleDrawIntersectionChange}
                // Remove onDrawingStateChange prop
                width={canvasSize}
                height={canvasSize}
              />
            ) : (
              <GraphCanvas
                width={canvasSize}
                height={canvasSize}
                selectedAnimation={selectedAnimation}
                verticalLineX={verticalLineX}
                verticalLineTestActive={true}
              />
            )}
          </div>
          <FlexiSliderColumn
            flexiImg={flexiImg}
            verticalLineX={verticalLineX}
            handleSliderChange={handleSliderChange}
            sliderDisabled={sliderDisabled}
            isDrawMode={selectedAnimation === 'draw'}
            // Remove these props - we don't need them anymore
            // hasDrawing={hasDrawing}
            // isActivelyDrawing={isActivelyDrawing}
          />
          {sliderDisabled && (
            <div style={{ color: 'red', marginTop: '1vh' }}>
              Vertical line test failed: more than one intersection!
            </div>
          )}
        </header>
      </div>
    </div>
  );
}

export default App;
