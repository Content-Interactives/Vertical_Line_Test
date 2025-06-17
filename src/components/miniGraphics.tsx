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
      {/* Realistic pencil positioned at the end of the curve */}
      <g transform="translate(32, 18) rotate(45)">
        {/* Pencil body (wood) */}
        <rect x="-1" y="-8" width="2" height="10" fill="#DEB887" stroke="#CD853F" strokeWidth="0.2" />
        {/* Metal ferrule */}
        <rect x="-1.2" y="-9.5" width="2.4" height="1.5" fill="#C0C0C0" stroke="#A0A0A0" strokeWidth="0.2" />
        {/* Eraser */}
        <rect x="-1" y="-10.5" width="2" height="1" fill="#FF69B4" stroke="#FF1493" strokeWidth="0.2" rx="0.5" />
        {/* Pencil tip (wood) */}
        <polygon points="-1,2 1,2 0,4" fill="#DEB887" stroke="#CD853F" strokeWidth="0.2" />
        {/* Graphite tip */}
        <polygon points="-0.5,4 0.5,4 0,5.5" fill="#2F2F2F" />
        {/* Brand text area */}
        <rect x="-0.8" y="-4" width="1.6" height="4" fill="#F5DEB3" opacity="0.7" />
      </g>
      {/* Small dots showing the pencil tip is touching the curve */}
      <circle cx="32" cy="18" r="0.5" fill="#333" opacity="0.5" />
      <rect x="0" y="0" width="40" height="40" fill="none" stroke="#ccc" />
    </svg>
  );
}
  