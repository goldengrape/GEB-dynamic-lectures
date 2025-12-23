import React, { useState, useEffect } from 'react';
import { Button } from '../Button';
import { RefreshCw, Zap } from 'lucide-react';

export const MetaThinkingViz: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [step, setStep] = useState(0);
  const [isStuck, setIsStuck] = useState(false);
  const [metaActive, setMetaActive] = useState(false);

  useEffect(() => {
    let interval: number;
    if (isRunning && !isStuck && !metaActive) {
      interval = window.setInterval(() => {
        setStep(s => {
            const next = s + 1;
            // Simulate a loop that never resolves
            if (next > 4) {
                return 0; // Infinite loop
            }
            return next;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isRunning, isStuck, metaActive]);

  useEffect(() => {
      // Simulate getting "stuck" in a loop after a few rotations
      if (isRunning && step === 4 && Math.random() > 0.5) {
          // It just loops, but let's visualize the "stuckness"
          // In this demo, user realizes it's a loop
      }
  }, [step, isRunning]);

  const steps = [
      "过程 A: 尝试规则 1",
      "过程 B: 尝试规则 2",
      "过程 C: 尝试规则 3",
      "过程 D: 检查目标",
      "循环回起点..."
  ];

  const handleMetaJump = () => {
      setMetaActive(true);
      setIsRunning(false);
  };

  const reset = () => {
      setIsRunning(false);
      setStep(0);
      setIsStuck(false);
      setMetaActive(false);
  };

  return (
    <div className="relative w-full max-w-md mx-auto h-96 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden flex flex-col items-center justify-center p-6">
      
      {/* The "System" Container */}
      <div className={`transition-all duration-700 ${metaActive ? 'scale-75 opacity-50 blur-[1px]' : 'scale-100'}`}>
          <div className="relative w-64 h-64 border-4 border-geb-dark rounded-full flex items-center justify-center">
             {steps.map((label, idx) => {
                 const angle = (idx / steps.length) * 2 * Math.PI - (Math.PI / 2);
                 const radius = 100;
                 const x = Math.cos(angle) * radius;
                 const y = Math.sin(angle) * radius;
                 const isActive = step === idx && isRunning;

                 return (
                     <div 
                        key={idx}
                        className={`absolute w-24 text-center text-[10px] font-bold transition-all duration-300 ${isActive ? 'text-red-600 scale-125' : 'text-gray-400'}`}
                        style={{ transform: `translate(${x}px, ${y}px)` }}
                     >
                         {label}
                     </div>
                 );
             })}

             <div className="z-10 bg-white p-2 rounded shadow text-center">
                 {isRunning ? <RefreshCw className="animate-spin text-geb-dark mx-auto"/> : <div className="text-gray-400 text-xs">系统空闲</div>}
             </div>
          </div>
      </div>

      {/* The Meta View Overlay */}
      {metaActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-geb-gold/10 backdrop-blur-sm z-20 animate-fade-in">
              <div className="bg-white p-6 rounded-lg shadow-xl border border-geb-gold text-center max-w-xs">
                  <h3 className="font-serif text-xl font-bold text-geb-accent mb-2">元视角</h3>
                  <p className="text-sm text-gray-700 mb-4">
                      你跳出了系统！你意识到内部系统只是在无限循环，无法通过自身规则达到目标（MU）。
                  </p>
                  <Button onClick={reset} variant="primary">重置系统</Button>
              </div>
          </div>
      )}

      {/* Controls */}
      {!metaActive && (
          <div className="absolute bottom-4 flex gap-3">
              <Button onClick={() => setIsRunning(!isRunning)} variant="outline">
                  {isRunning ? '暂停系统' : '运行系统'}
              </Button>
              
              {isRunning && (
                  <Button onClick={handleMetaJump} variant="secondary" className="animate-pulse shadow-lg shadow-yellow-500/50">
                     <Zap size={16} className="inline mr-1"/> 跳出
                  </Button>
              )}
          </div>
      )}
    </div>
  );
};