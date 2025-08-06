import React from 'react';
import { invertedSinWave } from './animations';
import {
  MiniLineGraph,
  MiniCircleGraph,
  MiniParabolaGraph,
  MiniParabola2Graph,
  MiniDrawIcon
} from './miniGraphics';

const animations = [
  { key: 'line', label: <MiniLineGraph /> },
  { key: 'circle', label: <MiniCircleGraph /> },
  { key: 'parabola', label: <MiniParabolaGraph /> },
  { key: 'parabola90', label: <MiniParabola2Graph /> },
  { key: 'draw', label: <MiniDrawIcon /> },

//   { key: 'invertedSinWave', label: 'SinWave'}
  // Add more as needed
];

interface AnimationMenuProps {
  selected: string;
  onSelect: (key: string) => void;
}

export default function AnimationMenu({ selected, onSelect }: AnimationMenuProps) {
  return (
    <div style={{ width: '25vw', padding: '2vw' }}>
      {animations.map(anim => (
        <button
          key={anim.key}
          style={{
            display: 'block',
            marginBottom: '1vh',
            background: selected === anim.key ? '#4caf50' : '#eee',
            color: selected === anim.key ? 'white' : 'black',
            width: '100%',
            padding: '1.5vw',
            border: 'none',
            borderRadius: '0.5vw',
            cursor: 'pointer'
          }}
          onClick={() => onSelect(anim.key)}
        >
          {anim.label}
        </button>
      ))}
    </div>
  );
}