import React, { useState, useEffect } from 'react';
import { Grid } from './Grid';
import { playSound } from '../services/audio';
import { GameState, PredictionResult, AccessKey, Language, Platform } from '../types';
import { translations } from '../translations';
import { 
    Zap,
    RotateCcw,
    Users,
    Globe,
    ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MotionDiv = motion.div as any;

interface AppleGameProps {
  onBack: () => void;
  accessKeyData: AccessKey | null;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  platform: Platform;
}

export const AppleGame: React.FC<AppleGameProps> = ({ onBack, accessKeyData, language, onLanguageChange, platform }) => {
  const [gameState, setGameState] = useState<GameState>(GameState.IDLE);
  const [predictionProgress, setPredictionProgress] = useState(0); 
  const t = (translations as any)[language];
  const isRtl = language === 'ar';
  const [onlineUsersCount, setOnlineUsersCount] = useState(() => Math.floor(Math.random() * (1000 - 50 + 1)) + 50);

  const [currentResult, setCurrentResult] = useState<PredictionResult | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
        setOnlineUsersCount(prev => {
            const change = Math.floor(Math.random() * 7) - 3;
            return Math.min(1000, Math.max(50, prev + change));
        });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handlePredict = async () => {
    if (gameState === GameState.ANALYZING) return;
    setGameState(GameState.ANALYZING);
    playSound('predict');
    
    // Progress bar logic
    setPredictionProgress(0);
    const duration = 2000;
    const interval = 20;
    const steps = duration / interval;
    const increment = 100 / steps;
    
    for (let i = 0; i <= steps; i++) {
        setPredictionProgress(Math.min(100, i * increment));
        await new Promise(r => setTimeout(r, interval));
    }
    
    const randomCol = Math.floor(Math.random() * 5);
    const result: PredictionResult = {
        path: [randomCol],
        confidence: 99, 
        analysis: "SYNCED",
        id: crypto.randomUUID(),
        timestamp: Date.now(),
    };

    playSound('success');
    setGameState(GameState.PREDICTED);
    setCurrentResult(result);
  };

  const handleNewGame = () => {
      playSound('click');
      setGameState(GameState.IDLE);
      setCurrentResult(null);
      playSound('success');
  };

  const isAnalyzing = gameState === GameState.ANALYZING;

  return (
    <div className={`flex flex-col h-full relative pt-0 select-none bg-black overflow-hidden ${isRtl ? 'font-ar' : 'font-en'}`}>
        {/* Particles Background */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ 
                        x: Math.random() * 400, 
                        y: Math.random() * 800,
                        opacity: Math.random() * 0.5
                    }}
                    animate={{ 
                        y: [null, -100],
                        opacity: [null, 0]
                    }}
                    transition={{ 
                        duration: Math.random() * 5 + 5, 
                        repeat: Infinity, 
                        ease: "linear",
                        delay: Math.random() * 5
                    }}
                    className="absolute w-1 h-1 bg-white rounded-full"
                />
            ))}
        </div>

        <header className="fixed top-0 left-0 right-0 z-[100] h-14 bg-black/80 backdrop-blur-md border-b border-blue-500/10 flex items-center justify-between px-6">
            <div className="flex items-center gap-3 flex-row">
                <button onClick={() => { playSound('click'); onBack(); }} className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/20 hover:border-blue-500 flex items-center justify-center transition-all active:scale-90 group">
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                </button>
                <div className="flex flex-col items-start">
                    <div className="border border-blue-500/30 rounded-[8px] px-2 py-1 bg-black/50 flex items-center gap-2.5">
                        <div className="w-5 h-5 rounded-md overflow-hidden border border-blue-500/40">
                            <img 
                                src="https://image2url.com/r2/default/images/1775220016764-cefe3d7b-9bc6-464b-a2ad-62153c543288.png" 
                                alt="Logo" 
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <h1 className="text-[9px] font-black text-white tracking-[0.1em] uppercase leading-none font-mono">
                            UPLINK: <span className="text-white">{accessKeyData?.key || "8963007529"}</span>
                        </h1>
                    </div>
                </div>
            </div>
            
            <div className="flex items-center gap-4">
                <button onClick={() => { playSound('toggle'); onLanguageChange(language === 'en' ? 'ar' : 'en'); }} className="h-9 px-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/20 hover:border-blue-500 active:scale-95 transition-all flex items-center justify-center group">
                    <Globe className="w-3.5 h-3.5 mr-1.5 text-white group-hover:rotate-180 transition-transform duration-700" />
                    <span className="text-[9px] font-black uppercase font-mono tracking-tighter">{language === 'en' ? 'AR' : 'EN'}</span>
                </button>
            </div>
        </header>

        <div className={`flex-1 flex flex-col items-center justify-center pt-20 pb-28 px-6 relative z-10 ${isRtl ? 'text-right' : 'text-left'}`}>
            <MotionDiv layout initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative mb-12 group z-10 shrink-0 transform-gpu w-full max-w-sm">
                <div className={`bg-black/40 p-4 rounded-[2.5rem] border transition-all duration-700 overflow-hidden min-h-[150px] flex flex-col justify-center ${isAnalyzing ? 'border-blue-500/50' : 'border-white/10'}`}>
                    <Grid path={currentResult?.path || []} isAnalyzing={isAnalyzing} predictionId={currentResult?.id} onCellClick={() => {}} rowCount={1} difficulty="Hard" gridData={currentResult?.gridData} language={language} />
                </div>
                
                <AnimatePresence>
                    {isAnalyzing && (
                        <MotionDiv 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute -bottom-20 left-0 right-0 px-4"
                        >
                            <div className="flex flex-col items-center gap-3">
                                <span className="text-[10px] font-black text-white uppercase tracking-[0.3em] animate-pulse">{t.connecting}</span>
                                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div 
                                        className="h-full bg-white"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${predictionProgress}%` }}
                                    />
                                </div>
                            </div>
                        </MotionDiv>
                    )}
                </AnimatePresence>

                <MotionDiv initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-5 bg-black border border-blue-500/30 px-6 py-2 rounded-2xl z-30 flex-row">
                    <div className="flex items-center gap-2.5 flex-row">
                        <div className={`w-2 h-2 rounded-full ${isAnalyzing ? 'bg-blue-500' : 'bg-blue-500/40'}`} />
                        <span className="text-[9px] font-mono text-white tracking-[0.25em] uppercase font-black">{isAnalyzing ? 'SCANNING' : 'LINKED'}</span>
                    </div>
                    <div className="w-px h-4 bg-white/10" />
                    <div className="flex items-center gap-2.5 flex-row">
                        <Users className="w-4 h-4 text-white" />
                        <span className="text-[11px] font-black text-white font-mono tracking-tighter">{onlineUsersCount.toLocaleString()}</span>
                    </div>
                </MotionDiv>
            </MotionDiv>

            <div className="space-y-4 relative z-10 shrink-0 w-full max-w-sm">
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={handlePredict} disabled={isAnalyzing} className="h-16 rounded-2xl bg-blue-600 text-white font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-95 transition-all shadow-lg hover:bg-blue-700 disabled:opacity-50">
                        <Zap className="w-5 h-5" />
                        <span>Start</span>
                    </button>
                    <button onClick={handleNewGame} disabled={isAnalyzing} className="h-16 rounded-2xl bg-white text-black font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-95 transition-all shadow-lg hover:bg-zinc-200 disabled:opacity-50">
                        <RotateCcw className="w-5 h-5" />
                        <span>Restart</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};
