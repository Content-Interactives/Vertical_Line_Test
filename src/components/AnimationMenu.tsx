import React from 'react';
import { invertedSinWave } from './animations';

const animations = [
  { key:'line', label: 'Line [Put images in]' }, // KEEP
  { key: 'circle', label: 'Circle' }, // KEEP
  //{ key: 'sinWave', label: 'SinWave'},
  //{ key: 'invertedSinWave', label: 'SinWave2'},
  { key:'parabola', label: 'Parabola' }, // KEEP
  { key: 'parabola90', label: 'Parabola2' }, // KEEP
  // TODO: Create an interactive that is a whole new graph to draw.
  // TODO: Add logic on it ending the function to show it is a valid function?
  // TODO: Move buttons on the top
  // TODO: Host the local code
  // LATER TODO: Draw ur own function

//   { key: 'invertedSinWave', label: 'SinWave'}
  // Add more as needed
];

interface AnimationMenuProps {
  selected: string;
  onSelect: (key: string) => void;
}

export default function AnimationMenu({ selected, onSelect }: AnimationMenuProps) {
  return (
    <div style={{ width: 200, padding: 16 }}>
      {animations.map(anim => (
        <button
          key={anim.key}
          style={{
            display: 'block',
            marginBottom: 8,
            background: selected === anim.key ? '#4caf50' : '#eee',
            color: selected === anim.key ? 'white' : 'black',
            width: '100%',
            padding: 12,
            border: 'none',
            borderRadius: 4,
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