import React, { useState } from 'react';
import { CHAPTERS, ChapterId } from './types';
import { EmergenceViz } from './components/visualizations/EmergenceViz';
import { RecursionViz } from './components/visualizations/RecursionViz';
import { FormalSystemViz } from './components/visualizations/FormalSystemViz';
import { IsomorphismViz } from './components/visualizations/IsomorphismViz';
import { MetaThinkingViz } from './components/visualizations/MetaThinkingViz';
import { FractalStackViz } from './components/visualizations/FractalStackViz';
import { BookOpen, Music, Brain, Hash, GitMerge, Square, Menu, X, Layers } from 'lucide-react';

const App: React.FC = () => {
  const [activeChapter, setActiveChapter] = useState<ChapterId>(ChapterId.INTRO);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const currentChapterData = CHAPTERS.find(c => c.id === activeChapter);

  const renderVisualization = () => {
    switch (activeChapter) {
      case ChapterId.EMERGENCE: return <EmergenceViz />;
      case ChapterId.RECURSION: return <RecursionViz />;
      case ChapterId.LECTURE_2: return <FractalStackViz />;
      case ChapterId.FORMAL_SYSTEMS: return <FormalSystemViz />;
      case ChapterId.ISOMORPHISM: return <IsomorphismViz />;
      case ChapterId.META_THINKING: return <MetaThinkingViz />;
      case ChapterId.INTRO:
      default:
        return (
          <div className="text-center p-12">
            <h3 className="text-6xl font-serif text-geb-dark mb-4">G E B</h3>
            <p className="text-xl text-gray-500 italic font-serif">意义的怪圈</p>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 opacity-80">
                <div className="p-4 bg-white shadow-sm border rounded">
                    <span className="block text-4xl mb-2">G</span>
                    <span className="text-xs uppercase tracking-widest">哥德尔 (数学)</span>
                </div>
                <div className="p-4 bg-white shadow-sm border rounded">
                    <span className="block text-4xl mb-2">E</span>
                    <span className="text-xs uppercase tracking-widest">埃舍尔 (艺术)</span>
                </div>
                <div className="p-4 bg-white shadow-sm border rounded">
                    <span className="block text-4xl mb-2">B</span>
                    <span className="text-xs uppercase tracking-widest">巴赫 (音乐)</span>
                </div>
            </div>
          </div>
        );
    }
  };

  const getIcon = (id: ChapterId) => {
    switch (id) {
        case ChapterId.INTRO: return <BookOpen size={18}/>;
        case ChapterId.EMERGENCE: return <Brain size={18}/>;
        case ChapterId.ISOMORPHISM: return <GitMerge size={18}/>;
        case ChapterId.RECURSION: return <Square size={18}/>;
        case ChapterId.LECTURE_2: return <Layers size={18}/>;
        case ChapterId.FORMAL_SYSTEMS: return <Hash size={18}/>;
        case ChapterId.META_THINKING: return <Music size={18}/>;
    }
  };

  return (
    <div className="flex h-screen bg-geb-paper text-geb-dark font-sans overflow-hidden">
      
      {/* Mobile Menu Button */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded shadow"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={20}/> : <Menu size={20}/>}
      </button>

      {/* Sidebar Navigation */}
      <div className={`
        fixed md:relative inset-y-0 left-0 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 z-40
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 border-b border-gray-100">
            <h1 className="font-serif text-2xl font-bold tracking-wide text-geb-dark">GEB</h1>
            <p className="text-xs text-geb-gold font-bold tracking-widest uppercase mt-1">集异璧之大成</p>
        </div>
        <nav className="p-4 space-y-2">
            {CHAPTERS.map((chapter) => (
                <button
                    key={chapter.id}
                    onClick={() => {
                        setActiveChapter(chapter.id);
                        setIsSidebarOpen(false);
                    }}
                    className={`
                        w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200
                        ${activeChapter === chapter.id 
                            ? 'bg-geb-dark text-geb-paper shadow-md' 
                            : 'hover:bg-gray-100 text-gray-600'}
                    `}
                >
                    {getIcon(chapter.id)}
                    <div>
                        <div className="font-semibold text-sm">{chapter.title}</div>
                        <div className={`text-[10px] ${activeChapter === chapter.id ? 'text-gray-400' : 'text-gray-400'}`}>
                            {chapter.subtitle}
                        </div>
                    </div>
                </button>
            ))}
        </nav>
        <div className="absolute bottom-0 w-full p-6 border-t border-gray-100 bg-gray-50">
             <p className="text-xs text-gray-400 leading-relaxed">
                 基于 MIT 课程讲座。
             </p>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto h-full relative">
          <div className="max-w-4xl mx-auto p-8 md:p-12 pb-24">
              
              {/* Header */}
              <header className="mb-12 border-b border-geb-gold/30 pb-6">
                <span className="text-geb-gold font-bold tracking-widest uppercase text-xs mb-2 block">
                    第 {CHAPTERS.findIndex(c => c.id === activeChapter) + 1} 章
                </span>
                <h2 className="text-4xl md:text-5xl font-serif text-geb-dark font-medium mb-4">
                    {currentChapterData?.title}
                </h2>
                <p className="text-xl text-gray-600 font-serif leading-relaxed max-w-2xl">
                    {currentChapterData?.description}
                </p>
              </header>

              {/* Visualization Container */}
              <div className="bg-gray-50/50 rounded-xl p-8 border border-gray-100 shadow-inner min-h-[400px] flex flex-col items-center justify-center">
                  {renderVisualization()}
              </div>

              {/* Lecture Notes / Context */}
              <div className="mt-12 prose prose-stone max-w-none">
                  {activeChapter === ChapterId.FORMAL_SYSTEMS && (
                      <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-100">
                          <h4 className="font-serif font-bold text-geb-accent">MU 谜题挑战</h4>
                          <p className="text-sm">
                              从 <strong>MI</strong> 开始。尝试得到 <strong>MU</strong>。 
                              你会发现你可以生成很多字符串，但 MU 却难以捉摸。
                              在系统<i>内部</i>思考（应用规则）无法告诉你原因。
                              你需要跳出系统<i>外部</i>（数 I 的个数）来解决它。
                          </p>
                      </div>
                  )}
                  {activeChapter === ChapterId.ISOMORPHISM && (
                      <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                          <h4 className="font-serif font-bold text-blue-900">解释</h4>
                          <p className="text-sm">
                              上面的盒子根据规则操作连字符。下面的盒子做数学运算。
                              因为连字符操作的结构完美映射了加法，我们说上面的系统“意味着”加法。
                              意义是符号系统与现实世界之间的同构。
                          </p>
                      </div>
                  )}
                  {activeChapter === ChapterId.LECTURE_2 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-100 p-6 rounded-lg border border-gray-200">
                            <h4 className="font-serif font-bold text-geb-dark mb-2">1. 递归与堆栈 (Recursive Stack)</h4>
                            <p className="text-sm text-gray-700">
                                为了防止无限循环，递归必须“触底”并返回。计算机使用“堆栈”来记住它在嵌套结构中的位置。
                                每一层新的分支都是一次“推入（Push）”，分支结束是一次“弹出（Pop）”。
                            </p>
                        </div>
                        <div className="bg-gray-100 p-6 rounded-lg border border-gray-200">
                            <h4 className="font-serif font-bold text-geb-dark mb-2">2. 科赫曲线 (Koch Curve)</h4>
                            <p className="text-sm text-gray-700">
                                一个经典的数学分形。通过在每条线段中间添加三角形，无论放大多少倍，形状都保持一致。
                                它展示了有限的面积可以拥有无限的周长。
                            </p>
                        </div>
                        <div className="bg-gray-100 p-6 rounded-lg border border-gray-200">
                            <h4 className="font-serif font-bold text-geb-dark mb-2">3. 混沌游戏 (Chaos Game)</h4>
                            <p className="text-sm text-gray-700">
                                谢尔宾斯基三角形不仅可以通过确定性的递归移除中心产生，也可以通过随机性产生。
                                简单的规则（“向随机顶点移动一半距离”）在大量迭代后涌现出复杂的有序结构。
                            </p>
                        </div>
                         <div className="bg-gray-100 p-6 rounded-lg border border-gray-200">
                            <h4 className="font-serif font-bold text-geb-dark mb-2">4. 曼德博集合 (Mandelbrot Set)</h4>
                            <p className="text-sm text-gray-700">
                                定义在复平面上的简单迭代 $z = z^2 + c$。
                                它的边界极其复杂，也是递归定义的。如果点在迭代中不逃逸到无穷大，它就属于该集合（黑色部分）。
                            </p>
                        </div>
                      </div>
                  )}
              </div>
          </div>
      </main>
    </div>
  );
};

export default App;