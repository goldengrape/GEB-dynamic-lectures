import React, { useState } from 'react';
import { Button } from '../Button';

interface Point {
  x: number;
  y: number;
}

export const RecursionViz: React.FC = () => {
  const [depth, setDepth] = useState(0);

  const drawSierpinski = (p1: Point, p2: Point, p3: Point, currentDepth: number): React.ReactElement[] => {
    if (currentDepth === 0) {
      return [
        <polygon 
          key={`${p1.x}-${p1.y}-${p2.x}-${p2.y}`} 
          points={`${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`} 
          fill="#D4AF37" // GEB Gold
          stroke="#1A1A1A"
          strokeWidth="0.5"
        />
      ];
    }

    const mid1 = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
    const mid2 = { x: (p2.x + p3.x) / 2, y: (p2.y + p3.y) / 2 };
    const mid3 = { x: (p1.x + p3.x) / 2, y: (p1.y + p3.y) / 2 };

    return [
      ...drawSierpinski(p1, mid1, mid3, currentDepth - 1),
      ...drawSierpinski(mid1, p2, mid2, currentDepth - 1),
      ...drawSierpinski(mid3, mid2, p3, currentDepth - 1)
    ];
  };

  const size = 300;
  const p1 = { x: size / 2, y: 10 };
  const p2 = { x: 10, y: size - 10 };
  const p3 = { x: size - 10, y: size - 10 };

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <svg width={size} height={size}>
          {drawSierpinski(p1, p2, p3, depth)}
        </svg>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button 
            variant="outline"
            onClick={() => setDepth(d => Math.max(0, d - 1))}
            disabled={depth === 0}
        >
            减少递归
        </Button>
        <span className="font-serif text-xl w-8 text-center">{depth}</span>
        <Button 
            variant="secondary"
            onClick={() => setDepth(d => Math.min(6, d + 1))}
            disabled={depth >= 6}
        >
            增加递归
        </Button>
      </div>
      <p className="text-sm text-center max-w-md text-gray-600">
        递归：用形状自身来定义形状。每个三角形都包含整体的更小版本。
      </p>
    </div>
  );
};