import React, { useState, useEffect } from 'react';
import './App.css';
import GraphCanvas from './components/GraphCanvas';
import AnimationMenu from './components/AnimationMenu';
import { allAnimations } from './components/animations';

function App() {
  const [showTitle, setShowTitle] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [selectedAnimation, setSelectedAnimation] = useState('linear');
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
            height: 500, // same as your graph height
            position: 'relative'
          }}>
            {/* Title above the graph */}
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
            <GraphCanvas
              width={500}
              height={500}
              selectedAnimation={selectedAnimation}
              verticalLineX={verticalLineX}
            />
          </div>
          <input
            type="range"
            min={0}
            max={500}
            value={verticalLineX}
            onChange={handleSliderChange}
            style={{ width: 500, marginTop: 16 }}
            disabled={sliderDisabled}
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
