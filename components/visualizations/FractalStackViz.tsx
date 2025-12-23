import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from '../Button';
import { Play, Pause, RotateCcw, Layers, RefreshCw, ZoomIn } from 'lucide-react';

// --- TYPES ---
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

// --- 1. STACK TREE VIZ (Original) ---
const StackTreeViz: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [stack, setStack] = useState<StackFrame[]>([]);
  const [lines, setLines] = useState<Line[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  
  const iteratorRef = useRef<Generator<any> | null>(null);
  const timerRef = useRef<number | null>(null);

  const startLen = 80;
  const shrinkFactor = 0.7;
  const angle = Math.PI / 6; 
  const maxDepth = 4;

  function* treeGenerator(x: number, y: number, len: number, a: number, depth: number, idCounter = { val: 0 }): Generator<any> {
    const currentId = idCounter.val++;
    
    yield {
      type: 'push',
      frame: { id: currentId, name: 'branch', depth, args: `len=${Math.round(len)}` }
    };

    const x2 = x + len * Math.sin(a);
    const y2 = y - len * Math.cos(a);
    
    yield {
      type: 'draw',
      line: { x1: x, y1: y, x2, y2, color: depth === 0 ? '#8B4513' : '#D4AF37' }
    };

    if (depth < maxDepth) {
      yield* treeGenerator(x2, y2, len * shrinkFactor, a - angle, depth + 1, idCounter);
      yield* treeGenerator(x2, y2, len * shrinkFactor, a + angle, depth + 1, idCounter);
    }

    yield { type: 'pop' };
  }

  const reset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsPlaying(false);
    setStack([]);
    setLines([]);
    setIsFinished(false);
    iteratorRef.current = treeGenerator(150, 280, startLen, 0, 0);
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
    if (action.type === 'push') setStack(prev => [action.frame, ...prev]);
    else if (action.type === 'pop') setStack(prev => prev.slice(1));
    else if (action.type === 'draw') setLines(prev => [...prev, action.line]);
  };

  useEffect(() => { reset(); return () => { if (timerRef.current) clearInterval(timerRef.current); }; }, []);

  useEffect(() => {
    if (isPlaying && !isFinished) timerRef.current = window.setInterval(step, 150);
    else if (timerRef.current) clearInterval(timerRef.current);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPlaying, isFinished]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, 280); ctx.lineTo(300, 280); ctx.stroke();

    lines.forEach(l => {
        ctx.beginPath(); ctx.moveTo(l.x1, l.y1); ctx.lineTo(l.x2, l.y2);
        ctx.strokeStyle = l.color; ctx.lineWidth = 2; ctx.stroke();
    });

    if (lines.length > 0 && !isFinished) {
        const last = lines[lines.length - 1];
        ctx.fillStyle = '#ff0000'; ctx.beginPath(); ctx.arc(last.x2, last.y2, 3, 0, Math.PI * 2); ctx.fill();
    }
  }, [lines, isFinished]);

  return (
    <div className="flex flex-col md:flex-row gap-6 h-[400px]">
      <div className="flex-1 flex flex-col items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <canvas ref={canvasRef} width={300} height={300} className="border border-gray-100 rounded bg-gray-50 mb-4"/>
        <div className="flex gap-4">
            <Button onClick={() => setIsPlaying(!isPlaying)} variant="primary" disabled={isFinished} className="w-24 flex justify-center items-center gap-2">
                {isPlaying ? <><Pause size={16}/> 暂停</> : <><Play size={16}/> 播放</>}
            </Button>
            <Button onClick={reset} variant="outline" title="Reset"><RotateCcw size={16}/></Button>
        </div>
      </div>
      <div className="w-full md:w-64 bg-gray-800 text-gray-100 p-4 rounded-lg shadow-inner flex flex-col overflow-hidden">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-600">
            <Layers size={18} className="text-geb-gold"/>
            <h4 className="font-mono text-sm font-bold">Call Stack</h4>
        </div>
        <div className="flex-1 overflow-y-auto space-y-1 relative">
            {stack.length === 0 && <div className="text-center text-gray-500 text-xs mt-10 italic">{isFinished ? 'Stack Empty' : 'Ready'}</div>}
            {stack.map(frame => (
                <div key={frame.id} className="bg-gray-700 p-2 rounded border-l-4 border-geb-gold text-xs font-mono" style={{ marginLeft: `${Math.min(frame.depth * 4, 20)}px` }}>
                    <div className="flex justify-between text-gray-300"><span>{frame.name}</span><span className="opacity-50">#{frame.id}</span></div>
                    <div className="text-geb-gold opacity-80 mt-1">{frame.args}</div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

// --- 2. KOCH CURVE VIZ ---
const KochViz: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [depth, setDepth] = useState(0);
  
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#1A1A1A';
        ctx.lineWidth = 1;

        interface Point { x: number; y: number; }

        const drawLine = (p1: Point, p2: Point) => {
            ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
        };

        const koch = (p1: Point, p2: Point, d: number) => {
            if (d === 0) {
                drawLine(p1, p2);
            } else {
                const dx = p2.x - p1.x;
                const dy = p2.y - p1.y;
                const pA = { x: p1.x + dx / 3, y: p1.y + dy / 3 };
                const pC = { x: p1.x + 2 * dx / 3, y: p1.y + 2 * dy / 3 };
                
                // Rotate pC around pA by -60 degrees to find peak
                const angle = -Math.PI / 3;
                const pB = {
                    x: pA.x + (pC.x - pA.x) * Math.cos(angle) - (pC.y - pA.y) * Math.sin(angle),
                    y: pA.y + (pC.x - pA.x) * Math.sin(angle) + (pC.y - pA.y) * Math.cos(angle)
                };

                koch(p1, pA, d - 1);
                koch(pA, pB, d - 1);
                koch(pB, pC, d - 1);
                koch(pC, p2, d - 1);
            }
        };

        // Draw visual box
        koch({ x: 20, y: 200 }, { x: 280, y: 200 }, depth);

    }, [depth]);
  
    return (
        <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <canvas ref={canvasRef} width={300} height={300} className="border border-gray-100 rounded bg-gray-50 mb-4"/>
            <div className="flex items-center gap-4">
                <Button onClick={() => setDepth(Math.max(0, depth - 1))} variant="outline" disabled={depth===0}>-</Button>
                <div className="font-serif text-lg w-20 text-center">Depth: {depth}</div>
                <Button onClick={() => setDepth(Math.min(5, depth + 1))} variant="secondary" disabled={depth===5}>+</Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">面积有限，周长无限。</p>
        </div>
    );
};

// --- 3. CHAOS GAME VIZ (Sierpinski) ---
const ChaosGameViz: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [points, setPoints] = useState(0);
    const requestRef = useRef<number | null>(null);
    const lastPointRef = useRef<{x: number, y: number} | null>(null);

    const vertices = [
        { x: 150, y: 20 },
        { x: 20, y: 280 },
        { x: 280, y: 280 }
    ];

    const draw = useCallback((ctx: CanvasRenderingContext2D) => {
        if (!lastPointRef.current) return;
        
        // Draw 50 points per frame for speed
        ctx.fillStyle = '#D4AF37';
        for (let i = 0; i < 50; i++) {
            const v = vertices[Math.floor(Math.random() * 3)];
            lastPointRef.current = {
                x: (lastPointRef.current.x + v.x) / 2,
                y: (lastPointRef.current.y + v.y) / 2
            };
            ctx.fillRect(lastPointRef.current.x, lastPointRef.current.y, 1.5, 1.5);
        }
        setPoints(p => p + 50);
        requestRef.current = requestAnimationFrame(() => draw(ctx));
    }, []);

    const start = () => {
        if (!isRunning) {
            setIsRunning(true);
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');
            if (canvas && ctx) {
                if (points === 0) {
                     // Init first random point
                    lastPointRef.current = { x: Math.random() * 300, y: Math.random() * 300 };
                    // Draw Vertices
                    ctx.fillStyle = '#1A1A1A';
                    vertices.forEach(v => {
                        ctx.beginPath(); ctx.arc(v.x, v.y, 4, 0, Math.PI*2); ctx.fill();
                    });
                }
                draw(ctx);
            }
        }
    };

    const stop = () => {
        setIsRunning(false);
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };

    const reset = () => {
        stop();
        setPoints(0);
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
    };

    return (
        <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-sm border border-gray-200">
             <canvas ref={canvasRef} width={300} height={300} className="border border-gray-100 rounded bg-gray-50 mb-4"/>
             <div className="flex items-center gap-4 mb-2">
                <Button onClick={isRunning ? stop : start} variant="primary" className="w-24">
                    {isRunning ? <><Pause size={14} className="inline mr-1"/> 暂停</> : <><Play size={14} className="inline mr-1"/> 开始</>}
                </Button>
                <Button onClick={reset} variant="outline"><RefreshCw size={14}/></Button>
             </div>
             <div className="text-xs text-gray-500">点数: {points}</div>
             <p className="text-xs text-gray-400 mt-1 max-w-xs text-center">规则：随机选取一个顶点，移动到当前点与该顶点的中点，画点。</p>
        </div>
    );
};

// --- 4. MANDELBROT VIZ ---
const MandelbrotViz: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [rendered, setRendered] = useState(false);

    const drawMandelbrot = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;
        const maxIter = 50;

        // Viewport
        const minX = -2.0;
        const maxX = 1.0;
        const minY = -1.5;
        const maxY = 1.5;

        const imgData = ctx.createImageData(width, height);
        const data = imgData.data;

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                let a = minX + (x / width) * (maxX - minX);
                let b = minY + (y / height) * (maxY - minY);
                let ca = a;
                let cb = b;
                let n = 0;

                while (n < maxIter) {
                    const aa = a * a - b * b;
                    const bb = 2 * a * b;
                    a = aa + ca;
                    b = bb + cb;
                    if (a * a + b * b > 4) break;
                    n++;
                }

                const pix = (x + y * width) * 4;
                if (n === maxIter) {
                    data[pix] = 0;     // R
                    data[pix + 1] = 0; // G
                    data[pix + 2] = 0; // B
                    data[pix + 3] = 255; // Alpha
                } else {
                    // Colorize based on iterations
                    const c = Math.floor((n / maxIter) * 255);
                    data[pix] = c;     // R
                    data[pix + 1] = c; // G
                    data[pix + 2] = 100; // B
                    data[pix + 3] = 255;
                }
            }
        }
        ctx.putImageData(imgData, 0, 0);
        setRendered(true);
    };

    return (
        <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <canvas ref={canvasRef} width={300} height={300} className="border border-gray-100 rounded bg-gray-50 mb-4"/>
            <Button onClick={drawMandelbrot} variant="primary" disabled={rendered} className="w-full">
                {rendered ? '已渲染' : '渲染曼德博集合'}
            </Button>
            <p className="text-xs text-gray-500 mt-2 max-w-xs text-center">
                z = z² + c. 黑色区域为集合内部，彩色为逃逸速度。
            </p>
        </div>
    );
};

// --- MAIN WRAPPER ---
export const FractalStackViz: React.FC = () => {
    const [tab, setTab] = useState<'stack' | 'koch' | 'chaos' | 'mandelbrot'>('stack');

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="flex flex-wrap justify-center gap-2 mb-6 p-1 bg-gray-100 rounded-lg inline-flex w-full">
                <button 
                    onClick={() => setTab('stack')}
                    className={`flex-1 py-2 px-4 rounded text-sm font-medium transition-colors ${tab==='stack' ? 'bg-white shadow text-geb-dark' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    递归树 (堆栈)
                </button>
                <button 
                    onClick={() => setTab('koch')}
                    className={`flex-1 py-2 px-4 rounded text-sm font-medium transition-colors ${tab==='koch' ? 'bg-white shadow text-geb-dark' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    科赫曲线
                </button>
                <button 
                    onClick={() => setTab('chaos')}
                    className={`flex-1 py-2 px-4 rounded text-sm font-medium transition-colors ${tab==='chaos' ? 'bg-white shadow text-geb-dark' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    混沌游戏
                </button>
                <button 
                    onClick={() => setTab('mandelbrot')}
                    className={`flex-1 py-2 px-4 rounded text-sm font-medium transition-colors ${tab==='mandelbrot' ? 'bg-white shadow text-geb-dark' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    曼德博集合
                </button>
            </div>

            <div className="min-h-[420px] animate-in fade-in duration-300">
                {tab === 'stack' && <StackTreeViz />}
                {tab === 'koch' && <KochViz />}
                {tab === 'chaos' && <ChaosGameViz />}
                {tab === 'mandelbrot' && <MandelbrotViz />}
            </div>
        </div>
    );
};