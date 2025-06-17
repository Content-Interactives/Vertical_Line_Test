import React from 'react';

export function MiniLineGraph() {
  return (
    <svg width="40" height="40">
      <line x1="5" y1="35" x2="35" y2="5" stroke="blue" strokeWidth="2" />
      <rect x="0" y="0" width="40" height="40" fill="none" stroke="#ccc" />
    </svg>
  );
}

export function MiniCircleGraph() {
  return (
    <svg width="40" height="40">
      <circle cx="20" cy="20" r="15" stroke="red" strokeWidth="2" fill="none" />
      <rect x="0" y="0" width="40" height="40" fill="none" stroke="#ccc" />
    </svg>
  );
}

export function MiniParabolaGraph() {
  // Downward-opening parabola (hill shape)
  return (
    <svg width="40" height="40">
      <path
        d="M10,10 Q20,60 30,10"
        stroke="green"
        strokeWidth="2"
        fill="none"
      />
      <rect x="0" y="0" width="40" height="40" fill="none" stroke="#ccc" />
    </svg>
  );
}

export function MiniParabola2Graph() {
  // Rightward-opening parabola (x = a(y-k)^2 + h)
  return (
    <svg width="40" height="40">
      <path 
        d="M40,15 Q0,20 40,25"
        stroke="purple" 
        strokeWidth="2" 
        fill="none" 
      />
      <rect x="0" y="0" width="40" height="40" fill="none" stroke="#ccc" />
    </svg>
  );
}

export function MiniDrawIcon() {
  return (
    <svg width="40" height="40">
      {/* Hand-drawn style curve with chaos/irregularity */}
      <path 
        d="M5,30 Q8,22 12,15 Q14,12 16,18 Q20,28 22,24 Q25,19 28,20 Q29,21 30,19 Q31,18 32,18" 
        stroke="#ff9800" 
        strokeWidth="2" 
        fill="none" 
        strokeLinecap="round"
      />
      {/* Tilted pencil positioned higher on the curve */}
      <g transform="translate(32, 18) rotate(45)">
        <rect x="-1" y="-6" width="2" height="8" fill="#8B4513" />
        <polygon points="-1,-6 1,-6 0,-9" fill="#FFD700" />
        <circle cx="0" cy="2" r="1" fill="#FF6B6B" />
      </g>
      {/* Small dots showing the pencil tip is touching the curve */}
      <circle cx="32" cy="18" r="0.5" fill="#333" opacity="0.5" />
      <rect x="0" y="0" width="40" height="40" fill="none" stroke="#ccc" />
    </svg>
  );
}
  