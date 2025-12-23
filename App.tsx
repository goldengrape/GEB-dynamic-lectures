import React, { useState } from 'react';
import { CHAPTERS, ChapterId } from './types';
import { EmergenceViz } from './components/visualizations/EmergenceViz';
import { RecursionViz } from './components/visualizations/RecursionViz';
import { FormalSystemViz } from './components/visualizations/FormalSystemViz';
import { IsomorphismViz } from './components/visualizations/IsomorphismViz';
import { MetaThinkingViz } from './components/visualizations/MetaThinkingViz';
import { StackTreeViz, KochViz, ChaosGameViz, MandelbrotViz } from './components/visualizations/FractalStackViz';
import { GeometryViz, ZenoViz, GodelViz, ConsistencyViz } from './components/visualizations/Lecture3Viz';
import { BookOpen, Music, Brain, Hash, GitMerge, Square, Menu, X, Layers, Activity, Triangle, Infinity as InfinityIcon, Globe, Box, Binary, ShieldCheck } from 'lucide-react';

const App: React.FC = () => {
  const [activeChapter, setActiveChapter] = useState<ChapterId>(ChapterId.INTRO);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const currentChapterData = CHAPTERS.find(c => c.id === activeChapter);

  const renderVisualization = () => {
    switch (activeChapter) {
      // Lecture 1
      case ChapterId.EMERGENCE: return <EmergenceViz />;
      case ChapterId.RECURSION_BASICS: return <RecursionViz />;
      case ChapterId.FORMAL_SYSTEMS: return <FormalSystemViz />;
      case ChapterId.ISOMORPHISM: return <IsomorphismViz />;
      case ChapterId.META_THINKING: return <MetaThinkingViz />;
      
      // Lecture 2
      case ChapterId.STACK_TREE: return <StackTreeViz />;
      case ChapterId.KOCH: return <KochViz />;
      case ChapterId.CHAOS: return <ChaosGameViz />;
      case ChapterId.MANDELBROT: return <MandelbrotViz />;

      // Lecture 3
      case ChapterId.GEOMETRY_MODELS: return <GeometryViz />;
      case ChapterId.ZENO_PARADOX: return <ZenoViz />;
      case ChapterId.GODEL_NUMBERING: return <GodelViz />;
      case ChapterId.CONSISTENCY_COMPLETENESS: return <ConsistencyViz />;

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
        // Lecture 1
        case ChapterId.INTRO: return <BookOpen size={18}/>;
        case ChapterId.EMERGENCE: return <Brain size={18}/>;
        case ChapterId.ISOMORPHISM: return <GitMerge size={18}/>;
        case ChapterId.RECURSION_BASICS: return <Square size={18}/>;
        case ChapterId.FORMAL_SYSTEMS: return <Hash size={18}/>;
        case ChapterId.META_THINKING: return <Music size={18}/>;
        
        // Lecture 2
        case ChapterId.STACK_TREE: return <Layers size={18}/>;
        case ChapterId.KOCH: return <Activity size={18}/>;
        case ChapterId.CHAOS: return <Triangle size={18}/>;
        case ChapterId.MANDELBROT: return <InfinityIcon size={18}/>;

        // Lecture 3
        case ChapterId.GEOMETRY_MODELS: return <Globe size={18}/>;
        case ChapterId.ZENO_PARADOX: return <Box size={18}/>;
        case ChapterId.GODEL_NUMBERING: return <Binary size={18}/>;
        case ChapterId.CONSISTENCY_COMPLETENESS: return <ShieldCheck size={18}/>;
    }
  };

  // Group chapters by lecture
  const lectures = Array.from(new Set(CHAPTERS.map(c => c.lecture)));

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
        overflow-y-auto
      `}>
        <div className="p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
            <h1 className="font-serif text-2xl font-bold tracking-wide text-geb-dark">GEB</h1>
            <p className="text-xs text-geb-gold font-bold tracking-widest uppercase mt-1">集异璧之大成</p>
        </div>
        
        <nav className="p-4 space-y-6">
            {lectures.map((lectureName) => (
                <div key={lectureName}>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">
                        {lectureName}
                    </h3>
                    <div className="space-y-1">
                        {CHAPTERS.filter(c => c.lecture === lectureName).map((chapter) => (
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
                                <span className={activeChapter === chapter.id ? 'text-geb-gold' : 'text-gray-400'}>
                                    {getIcon(chapter.id)}
                                </span>
                                <div>
                                    <div className="font-semibold text-sm">{chapter.title}</div>
                                    <div className={`text-[10px] ${activeChapter === chapter.id ? 'text-gray-400' : 'text-gray-400'}`}>
                                        {chapter.subtitle}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </nav>
        
        <div className="p-6 border-t border-gray-100 bg-gray-50">
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
                    {currentChapterData?.lecture}
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

              {/* Context Footer (Optional extra info) */}
              <div className="mt-12 prose prose-stone max-w-none">
                  {activeChapter === ChapterId.FORMAL_SYSTEMS && (
                      <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-100">
                          <h4 className="font-serif font-bold text-geb-accent">MU 谜题挑战</h4>
                          <p className="text-sm">
                              从 <strong>MI</strong> 开始。尝试得到 <strong>MU</strong>。 
                              你需要跳出系统<i>外部</i>（数 I 的个数）来解决它。
                          </p>
                      </div>
                  )}
                  {activeChapter === ChapterId.STACK_TREE && (
                       <p className="text-sm text-gray-600 italic">
                           计算机使用“堆栈”来追踪递归调用，防止在无限的分支中迷失。
                       </p>
                  )}
                  {activeChapter === ChapterId.GEOMETRY_MODELS && (
                      <p className="text-sm text-gray-600 italic">
                          讲座指出，一致性（无矛盾）往往取决于我们的解释。欧几里得几何和非欧几何在各自的解释下都是一致的。
                      </p>
                  )}
                  {activeChapter === ChapterId.ZENO_PARADOX && (
                      <p className="text-sm text-gray-600 italic">
                           这与《和声小迷宫》中的“金精”故事相呼应：通过每次将时间减半，无限的任务可以在有限的时间内完成。
                      </p>
                  )}
              </div>
          </div>
      </main>
    </div>
  );
};

export default App;