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
};

function FlexiSliderColumn({ flexiImg, verticalLineX, handleSliderChange, sliderDisabled }: FlexiSliderRowProps) {
  let speechText = "checking";
  if (sliderDisabled) {
    speechText = "Fail";
  } else if (verticalLineX === 500) {
    speechText = "Pass";
  }

  return (
    <div style={{ width: 500, display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '20px 0' }}>
      <input
        type="range"
        min={0}
        max={500}
        value={verticalLineX}
        onChange={handleSliderChange}
        style={{ width: '100%' }}
        disabled={sliderDisabled}
      />
      <div style={{ width: 500, display: 'flex', alignItems: 'flex-end', marginTop: 16 }}>
        <img src={flexiImg} alt="Flexi" style={{ width: 80, height: 80 }} />
        <div className="speech-bubble" style={{ marginLeft: 16, marginBottom: 8 }}>
          {speechText}
        </div>
      </div>
    </div>
  );
}

function GraphTitle() {
  return (
    <div style={{
      position: 'absolute',
      top: -50,
      left: '50%',
      transform: 'translateX(-50%)',
      fontSize: 28,
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
  const [showTitle, setShowTitle] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [selectedAnimation, setSelectedAnimation] = useState('line');
  const [verticalLineX, setVerticalLineX] = useState(250); // default to center
  const [sliderDisabled, setSliderDisabled] = useState(false);

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

    // Find the selected animation
    const selectedAnim = allAnimations.find(anim => anim.key === selectedAnimation);
    if (selectedAnim && selectedAnim.getIntersection) {
      const ys = selectedAnim.getIntersection(newX, 500, 500); // use your width/height
      setSliderDisabled(ys.length >= 2);
    }
  };

  useEffect(() => {
    setSliderDisabled(false);
    setVerticalLineX(0); // <-- Set to 0 for the left side
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
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: 500,
            position: 'relative'
          }}>
            <GraphTitle />
            {selectedAnimation === 'draw' ? (
              <DrawFunction verticalLineX={verticalLineX} />
            ) : (
              <GraphCanvas
                width={500}
                height={500}
                selectedAnimation={selectedAnimation}
                verticalLineX={verticalLineX}
              />
            )}
          </div>
          <FlexiSliderColumn
            flexiImg={flexiImg}
            verticalLineX={verticalLineX}
            handleSliderChange={handleSliderChange}
            sliderDisabled={sliderDisabled}
          />
          {sliderDisabled && (
            <div style={{ color: 'red', marginTop: 8 }}>
              Vertical line test failed: more than one intersection!
            </div>
          )}
        </header>
      </div>
    </div>
  );
}

export default App;
