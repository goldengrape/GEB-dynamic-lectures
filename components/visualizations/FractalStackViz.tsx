import React, { useEffect, useRef, useState } from 'react';
import { Button } from '../Button';
import { Play, Pause, RotateCcw, Layers } from 'lucide-react';

interface StackFrame {
  id: number;
  name: string;
  depth: number;
  args: string;
}

interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
}

export const FractalStackViz: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [stack, setStack] = useState<StackFrame[]>([]);
  const [lines, setLines] = useState<Line[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  
  // Ref to store the generator iterator
  const iteratorRef = useRef<Generator<any> | null>(null);
  const timerRef = useRef<number | null>(null);

  // Fractal Parameters
  const startLen = 80;
  const shrinkFactor = 0.7;
  const angle = Math.PI / 6; // 30 degrees
  const maxDepth = 4;

  // Generator function to simulate recursive process step-by-step
  function* treeGenerator(x: number, y: number, len: number, a: number, depth: number, idCounter = { val: 0 }): Generator<any> {
    const currentId = idCounter.val++;
    
    // PUSH
    yield {
      type: 'push',
      frame: { id: currentId, name: 'branch', depth, args: `len=${Math.round(len)}` }
    };

    // Draw the branch
    const x2 = x + len * Math.sin(a);
    const y2 = y - len * Math.cos(a);
    
    yield {
      type: 'draw',
      line: { x1: x, y1: y, x2, y2, color: depth === 0 ? '#8B4513' : '#D4AF37' }
    };

    if (depth < maxDepth) {
      // Recurse Left
      yield* treeGenerator(x2, y2, len * shrinkFactor, a - angle, depth + 1, idCounter);
      
      // Recurse Right
      yield* treeGenerator(x2, y2, len * shrinkFactor, a + angle, depth + 1, idCounter);
    }

    // POP
    yield { type: 'pop' };
  }

  const reset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsPlaying(false);
    setStack([]);
    setLines([]);
    setIsFinished(false);
    iteratorRef.current = treeGenerator(150, 280, startLen, 0, 0);
    
    // Clear canvas
    const canvas = canvasRef.current;
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const step = () => {
    if (!iteratorRef.current) return;

    const res = iteratorRef.current.next();
    
    if (res.done) {
      setIsPlaying(false);
      setIsFinished(true);
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const action = res.value;

    if (action.type === 'push') {
      setStack(prev => [action.frame, ...prev]);
    } else if (action.type === 'pop') {
      setStack(prev => prev.slice(1));
    } else if (action.type === 'draw') {
      setLines(prev => [...prev, action.line]);
    }
  };

  // Initialize on mount
  useEffect(() => {
    reset();
    return () => {
        if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Animation Loop
  useEffect(() => {
    if (isPlaying && !isFinished) {
      timerRef.current = window.setInterval(step, 200); // Speed of animation
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
        if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isFinished]);

  // Canvas Drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // We redraw everything each frame to keep it simple, 
    // though optimizing to only draw new lines is possible.
    // For this size, full redraw is fine.
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw ground
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 280);
    ctx.lineTo(300, 280);
    ctx.stroke();

    lines.forEach(l => {
        ctx.beginPath();
        ctx.moveTo(l.x1, l.y1);
        ctx.lineTo(l.x2, l.y2);
        ctx.strokeStyle = l.color;
        ctx.lineWidth = 2;
        ctx.stroke();
    });

    // Highlight current active point (tip of last line if exists)
    if (lines.length > 0 && !isFinished) {
        const last = lines[lines.length - 1];
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.arc(last.x2, last.y2, 3, 0, Math.PI * 2);
        ctx.fill();
    }

  }, [lines, isFinished]);

  return (
    <div className="w-full flex flex-col md:flex-row gap-6 h-[400px]">
      {/* Left: Visualization Area */}
      <div className="flex-1 flex flex-col items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h4 className="font-serif text-lg text-geb-dark mb-2">分形树 (Fractal Tree)</h4>
        <canvas 
            ref={canvasRef} 
            width={300} 
            height={300} 
            className="border border-gray-100 rounded bg-gray-50"
        />
        <div className="mt-4 flex gap-4">
            <Button onClick={() => setIsPlaying(!isPlaying)} variant="primary" disabled={isFinished} className="w-24 flex justify-center items-center gap-2">
                {isPlaying ? <><Pause size={16}/> 暂停</> : <><Play size={16}/> 播放</>}
            </Button>
            <Button onClick={reset} variant="outline" title="Reset">
                <RotateCcw size={16}/>
            </Button>
        </div>
      </div>

      {/* Right: Stack Visualization */}
      <div className="w-full md:w-64 bg-gray-800 text-gray-100 p-4 rounded-lg shadow-inner flex flex-col overflow-hidden">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-600">
            <Layers size={18} className="text-geb-gold"/>
            <h4 className="font-mono text-sm font-bold">Call Stack (调用栈)</h4>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-1 relative">
            {stack.length === 0 && isFinished && (
                <div className="text-center text-gray-500 text-xs mt-10 italic">
                    Stack Empty (Finished)
                </div>
            )}
            {stack.length === 0 && !isFinished && !isPlaying && lines.length === 0 && (
                <div className="text-center text-gray-500 text-xs mt-10 italic">
                    Ready to start...
                </div>
            )}
            
            {/* Render Stack Frames */}
            {stack.map((frame, index) => (
                <div 
                    key={frame.id}
                    className="bg-gray-700 p-2 rounded border-l-4 border-geb-gold text-xs font-mono animate-in fade-in slide-in-from-right-4 duration-200"
                    style={{ marginLeft: `${Math.min(frame.depth * 4, 20)}px` }}
                >
                    <div className="flex justify-between text-gray-300">
                        <span>{frame.name}()</span>
                        <span className="opacity-50">#{frame.id}</span>
                    </div>
                    <div className="text-geb-gold opacity-80 mt-1">
                        {frame.args}
                    </div>
                </div>
            ))}
        </div>
        <div className="mt-2 text-[10px] text-gray-400 text-center border-t border-gray-700 pt-2">
            Top of Stack = Current Execution
        </div>
      </div>
    </div>
  );
};