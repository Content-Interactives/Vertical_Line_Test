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
