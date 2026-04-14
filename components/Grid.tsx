import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Apple, AlertCircle, RotateCcw, Sparkles } from 'lucide-react';
import { translations } from '../translations';
import { Language } from '../types';

const MotionDiv = motion.div as any;

interface GridProps {
  path: number[]; 
  isAnalyzing: boolean;
  predictionId?: string;
  rowCount: number;
  difficulty: string;
  gridData?: boolean[][]; 
  language: Language;
}

const COLS = 5;

export const Grid: React.FC<GridProps> = ({ path, isAnalyzing, predictionId, rowCount, difficulty, gridData, language }) => {
  const [showSuccessFlash, setShowSuccessFlash] = useState(false);
  const t = (translations as any)[language];
  const renderRowIndices = useMemo(() => Array.from({ length: rowCount }, (_, i) => rowCount - 1 - i), [rowCount]);
  const isFailure = !isAnalyzing && predictionId && (path.length === 0 || path.every(v => v === -1));
  const isSuccess = !isAnalyzing && predictionId && !isFailure;

  useEffect(() => {
      if (isSuccess) {
          setShowSuccessFlash(true);
          const timer = setTimeout(() => setShowSuccessFlash(false), 800);
          return () => clearTimeout(timer);
      }
  }, [predictionId, isSuccess]);

  const boardLayout = useMemo(() => {
    if (!predictionId) return null;
    return Array.from({ length: rowCount }).map((_, rowIndex) => {
        const safeColIndex = path[rowIndex] !== undefined ? path[rowIndex] : -1;
        if (safeColIndex === -1 && !gridData) return Array(COLS).fill('unknown');
        if (gridData && gridData[rowIndex]) {
            const realRow = gridData[rowIndex];
            return realRow.map((isSafe, colIndex) => colIndex === safeColIndex ? 'path' : (isSafe ? 'good' : 'bad'));
        }
        const badAppleCounts = Array.from({ length: 10 }, (_, i) => i + 1 <= 4 ? 1 : (i + 1 <= 7 ? 2 : (i + 1 <= 9 ? 3 : 4)));
        const numBad = badAppleCounts[rowIndex] || 1;
        const indices = Array.from({ length: COLS }, (_, i) => i);
        const potentialBadIndices = indices.filter(i => i !== safeColIndex);
        for (let i = potentialBadIndices.length - 1; i > 0; i--) {
             const j = Math.floor(Math.random() * (i + 1));
             [potentialBadIndices[i], potentialBadIndices[j]] = [potentialBadIndices[j], potentialBadIndices[i]];
        }
        const badIndices = potentialBadIndices.slice(0, numBad);
        return indices.map(colIndex => colIndex === safeColIndex ? 'path' : (badIndices.includes(colIndex) ? 'bad' : 'good'));
    });
  }, [predictionId, path, rowCount, gridData]);

  return (
    <div className="relative w-full mx-auto select-none overflow-hidden h-full flex flex-col">
      <div className={`flex flex-col gap-4 p-2 relative z-10 flex-1 transition-all duration-500 ${showSuccessFlash ? 'brightness-125 scale-[1.02]' : ''}`}>
        
        {renderRowIndices.map((rowIndex) => {
          const hasSelection = path[rowIndex] !== undefined && path[rowIndex] !== -1;
          const showResult = (hasSelection || (path.length > 0 && path[0] !== -1)) && !isAnalyzing && boardLayout;
          let layoutRow: string[] = [];
          if (showResult && boardLayout && boardLayout[rowIndex]) {
              layoutRow = boardLayout[rowIndex];
          }
          return (
            <div key={`row-${rowIndex}`} className="flex items-center justify-center">
              <div className="grid grid-cols-5 gap-3 sm:gap-4 w-full max-w-md">
                {Array.from({ length: COLS }).map((_, colIndex) => {
                  const cellType = showResult && layoutRow.length > 0 ? layoutRow[colIndex] : 'unknown';
                  const isPath = cellType === 'path';
                  const isVisible = isPath && showResult;
                  
                  return (
                    <div 
                        key={`cell-${rowIndex}-${colIndex}`} 
                        className={`aspect-square w-full flex items-center justify-center relative rounded-2xl transition-all duration-700 border-2 overflow-hidden ${isVisible ? 'bg-green-500/20 border-green-500 shadow-[0_0_40px_rgba(var(--primary-color-rgb),0.4)]' : 'bg-white/[0.03] border-white/5 hover:border-white/20'}`}
                        style={isVisible ? { borderColor: 'var(--primary-color)', backgroundColor: 'rgba(var(--primary-color-rgb), 0.2)' } as any : {}}
                    >
                      {/* Internal Cell Glow */}
                      <div className={`absolute inset-0 opacity-20 bg-gradient-to-br from-white/10 to-transparent ${isVisible ? 'animate-pulse' : ''}`} />
                      
                      {isVisible ? (
                        <MotionDiv 
                            initial={{ scale: 0, rotate: -90, opacity: 0 }} 
                            animate={{ scale: 1, rotate: 0, opacity: 1 }} 
                            transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                            className="w-full h-full flex items-center justify-center p-2 relative z-10"
                        >
                          <div className="relative">
                            <motion.div 
                              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="absolute -inset-6 bg-green-500/40 blur-2xl rounded-full" 
                              style={{ backgroundColor: 'rgba(var(--primary-color-rgb), 0.4)' } as any} 
                            />
                            <Apple className="w-10 h-10 sm:w-12 sm:h-12 text-green-500 drop-shadow-[0_0_15px_rgba(var(--primary-color-rgb),0.8)]" style={{ color: 'var(--primary-color)' } as any} />
                          </div>
                        </MotionDiv>
                      ) : (
                        <div className="relative flex items-center justify-center w-full h-full">
                          <motion.div 
                              animate={isAnalyzing ? { 
                                  scale: [1, 1.5, 1],
                                  opacity: [0.1, 0.5, 0.1],
                                  backgroundColor: ['rgba(255,255,255,0.1)', 'rgba(var(--primary-color-rgb), 0.5)', 'rgba(255,255,255,0.1)']
                              } : {}}
                              transition={{ duration: 1.5, repeat: Infinity, delay: (rowIndex * 5 + colIndex) * 0.05 }}
                              className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${isAnalyzing ? 'shadow-[0_0_15px_var(--primary-color)]' : 'bg-white/10'}`} 
                              style={isAnalyzing ? { backgroundColor: 'var(--primary-color)' } : {}} 
                          />
                          {/* Tech Corner Accents */}
                          <div className="absolute top-1 left-1 w-1 h-1 border-t border-l border-white/10" />
                          <div className="absolute bottom-1 right-1 w-1 h-1 border-b border-r border-white/10" />
                        </div>
                      )}

                      {/* Success Particles */}
                      {isVisible && (
                        <div className="absolute inset-0 pointer-events-none">
                          {[...Array(6)].map((_, i) => (
                              <motion.div
                                  key={i}
                                  initial={{ scale: 0, x: 0, y: 0 }}
                                  animate={{ 
                                      scale: [0, 1, 0],
                                      x: (Math.random() - 0.5) * 40,
                                      y: (Math.random() - 0.5) * 40
                                  }}
                                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                                  className="absolute top-1/2 left-1/2 w-1 h-1 bg-yellow-400 rounded-full blur-[1px]"
                              />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Failure Overlay */}
      <AnimatePresence>
        {isFailure && (
            <MotionDiv 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute inset-0 z-[60] flex flex-col items-center justify-center bg-black/90 backdrop-blur-2xl p-8 text-center"
            >
                <div className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">
                    {language === 'ar' ? 'عذراً، حاول مرة أخرى' : 'Oops, Try Again'}
                </h3>
                <p className="text-zinc-400 text-sm font-medium mb-8 max-w-[240px]">
                    {language === 'ar' ? 'حدث خطأ في الاتصال، يرجى إعادة المحاولة' : 'Connection error occurred, please try again.'}
                </p>
                <button 
                    onClick={() => { window.location.reload(); }} 
                    className="w-full max-w-[200px] h-16 bg-white text-black font-black text-sm uppercase tracking-widest rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-3 shadow-2xl"
                >
                    <RotateCcw className="w-5 h-5" />
                    <span>{language === 'ar' ? 'إعادة المحاولة' : 'Try Again'}</span>
                </button>
            </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  );
};
