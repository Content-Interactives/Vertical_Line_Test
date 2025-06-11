import React, { useState, useEffect } from 'react';
import './App.css';
import GraphCanvas from './components/GraphCanvas';

function App() {
  const [showTitle, setShowTitle] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

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

  return (
    <div className="App">
      <header className="App-header">
        <div className="title-container">
          {showTitle && (
            <h1 className={`function-title ${fadeOut ? 'fade-out' : ''}`}>
              It's a function
            </h1>
          )}
        </div>
        <GraphCanvas 
          width={500} 
          height={500} 
          onAnimationComplete={handleAnimationComplete}
          onAnimationStart={handleAnimationStart}
        />
      </header>
    </div>
  );
}

export default App;
