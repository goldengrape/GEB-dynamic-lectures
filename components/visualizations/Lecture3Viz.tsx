import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../Button';
import { ArrowRight, Globe, Box, Plus, Hash } from 'lucide-react';

// --- 1. NON-EUCLIDEAN GEOMETRY VIZ ---
export const GeometryViz: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [curvature, setCurvature] = useState(0); // -1 (Hyperbolic) to 1 (Spherical)

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const w = canvas.width;
        const h = canvas.height;
        const cx = w / 2;
        const cy = h / 2 + 20;

        ctx.clearRect(0, 0, w, h);

        // Draw "Space"
        if (curvature > 0.1) {
            // Sphere look
            const grad = ctx.createRadialGradient(cx, cy, 20, cx, cy, 140);
            grad.addColorStop(0, '#fefefe');
            grad.addColorStop(1, '#e0e0e0');
            ctx.fillStyle = grad;
            ctx.beginPath(); ctx.arc(cx, cy, 130, 0, Math.PI * 2); ctx.fill();
        } else if (curvature < -0.1) {
            // Hyperbolic/Saddle look (abstract)
            ctx.fillStyle = '#f8f8f8';
            ctx.beginPath(); ctx.arc(cx, cy, 130, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = '#ddd';
            ctx.beginPath(); ctx.moveTo(cx-130, cy); ctx.quadraticCurveTo(cx, cy+60, cx+130, cy); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(cx, cy-130); ctx.quadraticCurveTo(cx, cy+60, cx, cy+130); ctx.stroke();
        } else {
            // Flat
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(20, 20, w-40, h-40);
            ctx.strokeStyle = '#eee';
            ctx.strokeRect(20, 20, w-40, h-40);
        }

        // Triangle Points
        const p1 = { x: cx, y: cy - 80 };
        const p2 = { x: cx - 70, y: cy + 50 };
        const p3 = { x: cx + 70, y: cy + 50 };

        // Draw Triangle with Curvature
        ctx.strokeStyle = '#1A1A1A';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        
        // Use quadratic curves to simulate bowed lines
        // Control point offset is proportional to curvature
        const curveStrength = curvature * 40;

        // Line 1: p1 -> p2
        let cp1 = { x: (p1.x + p2.x)/2 - curveStrength, y: (p1.y + p2.y)/2 - curveStrength };
        ctx.quadraticCurveTo(cp1.x, cp1.y, p2.x, p2.y);

        // Line 2: p2 -> p3
        let cp2 = { x: (p2.x + p3.x)/2, y: (p2.y + p3.y)/2 + curveStrength };
        ctx.quadraticCurveTo(cp2.x, cp2.y, p3.x, p3.y);

        // Line 3: p3 -> p1
        let cp3 = { x: (p3.x + p1.x)/2 + curveStrength, y: (p3.y + p1.y)/2 - curveStrength };
        ctx.quadraticCurveTo(cp3.x, cp3.y, p1.x, p1.y);

        ctx.fillStyle = 'rgba(212, 175, 55, 0.2)'; // Gold fill
        ctx.fill();
        ctx.stroke();

        // Draw Vertices
        ctx.fillStyle = '#8B4513';
        [p1, p2, p3].forEach(p => {
            ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI*2); ctx.fill();
        });

    }, [curvature]);

    const getAngleSumText = () => {
        if (Math.abs(curvature) < 0.1) return "= 180° (欧几里得平坦空间)";
        if (curvature > 0) return "> 180° (球面/椭圆空间)";
        return "< 180° (双曲空间)";
    };

    return (
        <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-sm border border-gray-200 w-full max-w-lg">
            <h4 className="font-serif text-xl mb-4 text-geb-dark">三角形内角和</h4>
            <canvas ref={canvasRef} width={300} height={300} className="border border-gray-100 rounded mb-6"/>
            
            <div className="w-full px-8">
                <input 
                    type="range" 
                    min="-1" 
                    max="1" 
                    step="0.01" 
                    value={curvature}
                    onChange={(e) => setCurvature(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-geb-gold"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2 font-serif">
                    <span>双曲 (Hyperbolic)</span>
                    <span>平坦 (Flat)</span>
                    <span>球面 (Spherical)</span>
                </div>
            </div>

            <div className="mt-6 text-lg font-bold text-geb-accent animate-pulse">
                Sum {getAngleSumText()}
            </div>
            <p className="mt-2 text-sm text-center text-gray-600">
                “直线”的定义取决于空间模型。在一个模型中的真理（sum=180）在另一个模型中可能为假。
            </p>
        </div>
    );
};

// --- 2. ZENO'S PARADOX VIZ ---
export const ZenoViz: React.FC = () => {
    const [steps, setSteps] = useState(0);
    const totalDist = 280; // pixels
    
    // Calculate current position: sum(1/2^n)
    let position = 0;
    let time = 0;
    for(let i=1; i<=steps; i++) {
        position += totalDist / Math.pow(2, i);
        time += 1 / Math.pow(2, i);
    }
    
    // To make it visually reach end effectively for user
    const percentage = Math.min((position / totalDist) * 100, 100);

    return (
        <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-sm border border-gray-200 w-full max-w-lg">
            <h4 className="font-serif text-xl mb-6 text-geb-dark">有限时间的无限步骤</h4>
            
            <div className="relative w-full h-16 bg-gray-100 rounded-full border border-gray-300 mb-8 flex items-center px-2">
                {/* Target */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-geb-dark rounded text-white flex items-center justify-center text-xs z-10">
                    END
                </div>

                {/* Runner */}
                <div 
                    className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-geb-gold rounded-full shadow-md transition-all duration-500 ease-out z-20 flex items-center justify-center text-[10px] text-white font-bold"
                    style={{ left: `${percentage}%` }}
                >
                    A
                </div>

                {/* Markers */}
                <div className="absolute bottom-0 w-full h-full pointer-events-none">
                    <div className="absolute left-[50%] bottom-0 h-2 w-[1px] bg-gray-400"></div>
                    <div className="absolute left-[75%] bottom-0 h-2 w-[1px] bg-gray-400"></div>
                    <div className="absolute left-[87.5%] bottom-0 h-2 w-[1px] bg-gray-400"></div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-8 text-center mb-6 w-full">
                <div className="bg-gray-50 p-2 rounded">
                    <div className="text-xs text-gray-500 uppercase">步骤数</div>
                    <div className="text-xl font-mono">{steps}</div>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                    <div className="text-xs text-gray-500 uppercase">耗时 (Total = 1)</div>
                    <div className="text-xl font-mono">{time.toFixed(4)}...</div>
                </div>
            </div>

            <div className="flex gap-4">
                <Button onClick={() => setSteps(s => s + 1)} variant="primary">
                    <Plus size={16} className="inline mr-1"/> 下一步 (+1/2^n)
                </Button>
                <Button onClick={() => setSteps(0)} variant="outline">重置</Button>
            </div>
            
            <div className="mt-4 text-xs text-gray-400 max-w-xs text-center">
                1/2 + 1/4 + 1/8 + 1/16 + ... = 1 <br/>
                无限个时间片段的总和是一个有限的数字。
            </div>
        </div>
    );
};

// --- 3. GODEL NUMBERING VIZ ---
export const GodelViz: React.FC = () => {
    const [input, setInput] = useState("MIU");
    
    // Simple demo mapping, not prime factorization to avoid massive numbers in UI
    const mapping: {[key:string]: number} = {
        'M': 3,
        'I': 1,
        'U': 0
    };

    const getNumber = () => {
        // A toy conceptualization: Concatenating digits (base 10 representation roughly)
        // Real Gödel numbering uses primes: 2^m * 3^i * 5^u ...
        const digits = input.split('').map(char => mapping[char] !== undefined ? mapping[char] : '?').join('');
        return digits;
    };

    const getPrimeForm = () => {
         const parts = input.split('').map((char, index) => {
             const power = mapping[char] !== undefined ? mapping[char] : 0;
             const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];
             const prime = primes[index] || `p${index+1}`;
             return `${prime}^${power}`;
         });
         return parts.join(' × ');
    };

    return (
        <div className="flex flex-col bg-white p-6 rounded-lg shadow-sm border border-gray-200 w-full max-w-lg">
             <div className="mb-6">
                <h4 className="font-serif text-xl text-geb-dark mb-1">哥德尔配数 (Conceptual)</h4>
                <p className="text-xs text-gray-500">将形式系统的字符串转换为唯一的数字。</p>
             </div>

             <div className="flex items-center gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
                 <div className="flex-1">
                     <label className="text-xs font-bold text-gray-400 block mb-1">输入字符串 (仅 M, I, U)</label>
                     <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value.toUpperCase().replace(/[^MIU]/g, '').slice(0, 8))}
                        className="w-full text-2xl font-mono bg-white border border-gray-200 rounded p-2 text-center tracking-widest text-geb-dark"
                        placeholder="MI"
                     />
                 </div>
                 <ArrowRight className="text-gray-300"/>
                 <div className="flex-1 text-center">
                     <label className="text-xs font-bold text-gray-400 block mb-1">哥德尔数 g(S)</label>
                     <div className="text-2xl font-mono text-geb-gold font-bold">{getNumber()}</div>
                 </div>
             </div>

             <div className="space-y-4">
                 <div className="p-3 border border-dashed border-gray-300 rounded bg-gray-50/50">
                     <div className="text-xs text-gray-500 mb-2">简单映射规则:</div>
                     <div className="flex justify-center gap-8 font-mono text-sm">
                         <span>M &rarr; 3</span>
                         <span>I &rarr; 1</span>
                         <span>U &rarr; 0</span>
                     </div>
                 </div>

                 <div className="p-3 border border-blue-100 bg-blue-50 rounded text-sm text-blue-900">
                     <div className="font-bold mb-1">素数分解形式 (理论):</div>
                     <div className="font-mono text-xs break-all opacity-80">
                         {getPrimeForm()} ...
                     </div>
                 </div>
                 
                 <p className="text-sm text-gray-600 leading-relaxed">
                     一旦字符串变成了数字，数学（算术）就可以谈论字符串的结构。
                     这允许系统构建一个说“我是不可证明的”的数字公式。
                 </p>
             </div>
        </div>
    );
};

// --- 4. CONSISTENCY & COMPLETENESS ---
export const ConsistencyViz: React.FC = () => {
    // A simplified visual metaphor
    return (
        <div className="flex flex-col items-center bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center max-w-lg">
            <div className="flex justify-center gap-8 mb-8">
                <div className="w-32 h-32 rounded-full border-4 border-green-500 flex items-center justify-center p-2 relative group">
                    <span className="font-serif font-bold text-green-700">一致性</span>
                    <div className="absolute top-full mt-2 text-[10px] text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity w-40">
                        系统内没有矛盾。你永远不会证明 "P" 和 "非P"。
                    </div>
                </div>
                <div className="w-32 h-32 rounded-full border-4 border-blue-500 flex items-center justify-center p-2 relative group">
                    <span className="font-serif font-bold text-blue-700">完全性</span>
                     <div className="absolute top-full mt-2 text-[10px] text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity w-40">
                        所有真理都可被证明。如果它是真的，系统就能生成它。
                    </div>
                </div>
            </div>
            
            <div className="bg-red-50 border border-red-100 p-4 rounded-lg relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded font-bold uppercase">
                    哥德尔的发现
                </div>
                <p className="text-geb-dark font-serif text-lg mb-2">
                    对于任何足够复杂的系统（如算术）：
                </p>
                <p className="text-gray-600 text-sm">
                    如果你想要<b>一致性</b>，你就必须牺牲<b>完全性</b>。
                    总会有一些既是真的，又无法在系统内证明的命题。
                </p>
            </div>
        </div>
    );
};