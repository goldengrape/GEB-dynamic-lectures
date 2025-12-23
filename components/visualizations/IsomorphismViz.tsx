import React, { useState } from 'react';

export const IsomorphismViz: React.FC = () => {
  const [val1, setVal1] = useState(2);
  const [val2, setVal2] = useState(3);

  const generateHyphens = (count: number) => Array(count).fill('-').join('');

  const pHyphens = generateHyphens(val1);
  const qHyphens = generateHyphens(val2);
  const resultHyphens = generateHyphens(val1 + val2);

  const pqString = `${pHyphens}p${qHyphens}q${resultHyphens}`;

  return (
    <div className="flex flex-col space-y-8 max-w-xl mx-auto">
      {/* The PQ System (Meaningless Symbols) */}
      <div className="bg-geb-dark text-geb-paper p-6 rounded-lg shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-2 opacity-10 font-serif text-4xl font-bold">PQ System</div>
        <div className="text-center">
            <div className="text-xs uppercase tracking-widest text-gray-400 mb-4">形式系统 (符号)</div>
            <div className="font-mono text-xl md:text-2xl break-all">
                <span className="text-yellow-500">{pHyphens}</span>
                <span className="text-white font-bold mx-1">P</span>
                <span className="text-yellow-500">{qHyphens}</span>
                <span className="text-white font-bold mx-1">Q</span>
                <span className="text-yellow-500">{resultHyphens}</span>
            </div>
        </div>
      </div>

      {/* The Isomorphism (The Bridge) */}
      <div className="flex justify-center items-center gap-4 text-geb-accent opacity-70">
         <div className="h-8 w-[1px] bg-geb-accent"></div>
         <span className="font-serif italic text-lg">同构映射</span>
         <div className="h-8 w-[1px] bg-geb-accent"></div>
      </div>

      {/* Arithmetic (Meaning) */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
         <div className="absolute top-0 right-0 p-2 opacity-10 font-serif text-4xl font-bold">Math</div>
         <div className="text-center mb-6">
            <div className="text-xs uppercase tracking-widest text-gray-400 mb-2">解释 (意义)</div>
            <div className="font-serif text-3xl text-geb-dark">
                {val1} + {val2} = {val1 + val2}
            </div>
         </div>

         <div className="flex gap-4 justify-center">
            <div className="flex flex-col items-center">
                <label className="text-xs text-gray-500 mb-1">输入 1</label>
                <input 
                    type="number" 
                    min="1" 
                    max="9" 
                    value={val1}
                    onChange={(e) => setVal1(parseInt(e.target.value) || 0)}
                    className="w-16 p-2 border rounded text-center"
                />
            </div>
            <div className="flex flex-col items-center">
                <label className="text-xs text-gray-500 mb-1">输入 2</label>
                 <input 
                    type="number" 
                    min="1" 
                    max="9" 
                    value={val2}
                    onChange={(e) => setVal2(parseInt(e.target.value) || 0)}
                    className="w-16 p-2 border rounded text-center"
                />
            </div>
         </div>
      </div>
      
      <p className="text-sm text-gray-600 italic text-center px-4">
        “当符号（连字符）的结构反映了现实（加法）的结构时，意义就产生了。”
      </p>
    </div>
  );
};