import React, { useState } from 'react';
import { Button } from '../Button';
import { ArrowRight, RotateCcw, AlertTriangle } from 'lucide-react';

export const FormalSystemViz: React.FC = () => {
  const [currentString, setCurrentString] = useState('MI');
  const [history, setHistory] = useState<string[]>(['MI']);
  const [error, setError] = useState<string | null>(null);

  const addToHistory = (newStr: string) => {
    setCurrentString(newStr);
    setHistory([...history, newStr]);
    setError(null);
  };

  const reset = () => {
    setCurrentString('MI');
    setHistory(['MI']);
    setError(null);
  };

  // Rule 1: Add U to end if ends in I
  const rule1 = () => {
    if (currentString.endsWith('I')) {
      addToHistory(currentString + 'U');
    } else {
      setError("规则 1 失败：字符串未以 'I' 结尾。");
    }
  };

  // Rule 2: Double string after M
  const rule2 = () => {
    if (currentString.startsWith('M')) {
      const tail = currentString.substring(1);
      addToHistory('M' + tail + tail);
    } else {
       setError("规则 2 失败：字符串未以 'M' 开头。");
    }
  };

  // Rule 3: Replace III with U
  const rule3 = () => {
    if (currentString.includes('III')) {
      // For simplicity in this demo, we replace the first occurrence. 
      // A full implementation would let user select which III.
      addToHistory(currentString.replace('III', 'U'));
    } else {
      setError("规则 3 失败：字符串不包含 'III'。");
    }
  };

  // Rule 4: Drop UU
  const rule4 = () => {
    if (currentString.includes('UU')) {
      addToHistory(currentString.replace('UU', ''));
    } else {
      setError("规则 4 失败：字符串不包含 'UU'。");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col md:flex-row gap-6">
      {/* Left: Game Area */}
      <div className="flex-1 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="mb-6 text-center">
            <h3 className="text-gray-500 uppercase text-xs tracking-wider mb-2">当前定理</h3>
            <div className="text-5xl font-serif text-geb-dark font-bold tracking-widest break-all">
                {currentString}
            </div>
            {error && (
                <div className="mt-2 text-red-500 text-sm flex items-center justify-center gap-1 animate-pulse">
                    <AlertTriangle size={14} /> {error}
                </div>
            )}
        </div>

        <div className="grid grid-cols-1 gap-3">
            <Button onClick={rule1} variant="outline" className="justify-between flex items-center group">
                <span>规则 I: xI &rarr; xIU</span>
                <span className="text-xs text-gray-400 group-hover:text-geb-dark">末尾加 U</span>
            </Button>
            <Button onClick={rule2} variant="outline" className="justify-between flex items-center group">
                <span>规则 II: Mx &rarr; Mxx</span>
                 <span className="text-xs text-gray-400 group-hover:text-geb-dark">M 之后部分双倍</span>
            </Button>
            <Button onClick={rule3} variant="outline" className="justify-between flex items-center group">
                <span>规则 III: xIIIy &rarr; xUy</span>
                 <span className="text-xs text-gray-400 group-hover:text-geb-dark">III 变为 U</span>
            </Button>
            <Button onClick={rule4} variant="outline" className="justify-between flex items-center group">
                <span>规则 IV: xUUy &rarr; xy</span>
                 <span className="text-xs text-gray-400 group-hover:text-geb-dark">去掉 UU</span>
            </Button>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
             <span className="text-xs text-gray-500">目标：得到 "MU"</span>
             <button onClick={reset} className="text-sm text-geb-accent hover:underline flex items-center gap-1">
                 <RotateCcw size={14}/> 重置
             </button>
        </div>
      </div>

      {/* Right: Derivation History */}
      <div className="w-full md:w-48 bg-gray-50 p-4 rounded-lg border border-gray-200 h-80 overflow-y-auto">
        <h4 className="font-serif font-bold text-geb-dark mb-3 border-b pb-2">推导过程</h4>
        <div className="space-y-2">
            {history.map((step, idx) => (
                <div key={idx} className="flex items-center text-sm font-mono text-gray-600">
                    <span className="w-6 text-gray-300 text-xs">{idx + 1}.</span>
                    <span>{step}</span>
                </div>
            ))}
            <div className="flex items-center text-sm text-gray-400 animate-pulse">
                <ArrowRight size={12} className="mr-2"/> ?
            </div>
        </div>
      </div>
    </div>
  );
};