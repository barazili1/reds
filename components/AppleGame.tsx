import React, { useState, useEffect } from 'react';
import { Grid } from './Grid';
import { playSound } from '../services/audio';
import { GameState, PredictionResult, AccessKey, Language, Platform } from '../types';
import { translations } from '../translations';
import { 
    Zap,
    RotateCcw,
    Users
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
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [loadingStep, setLoadingStep] = useState(0);
  const t = (translations as any)[language];
  const isRtl = language === 'ar';
  const [onlineUsersCount, setOnlineUsersCount] = useState(() => Math.floor(Math.random() * (1000 - 50 + 1)) + 50);

  const [currentResult, setCurrentResult] = useState<PredictionResult | null>(null);

  useEffect(() => {
    if (isInitialLoading) {
      const timer1 = setTimeout(() => setLoadingStep(1), 1000);
      const timer2 = setTimeout(() => setLoadingStep(2), 2000);
      const timer3 = setTimeout(() => setIsInitialLoading(false), 3000);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [isInitialLoading]);

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

    <div className={`flex-1 flex flex-col items-center justify-center pt-10 pb-28 px-6 relative z-10 ${isRtl ? 'text-right' : 'text-left'} ${isInitialLoading ? 'blur-md' : ''}`}>
            <MotionDiv layout initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative mb-12 group z-10 shrink-0 transform-gpu w-full max-w-sm">
                <div className={`bg-black/40 p-4 rounded-[2.5rem] border transition-all duration-700 overflow-hidden min-h-[150px] flex flex-col justify-center ${isAnalyzing ? 'border-green-500/50' : 'border-white/10'}`}>
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
                                        className="h-full bg-green-500"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${predictionProgress}%` }}
                                    />
                                </div>
                            </div>
                        </MotionDiv>
                    )}
                </AnimatePresence>

                <MotionDiv initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-5 bg-black border border-green-500/30 px-6 py-2 rounded-2xl z-30 flex-row">
                    <div className="flex items-center gap-2.5 flex-row">
                        <div className={`w-2 h-2 rounded-full ${isAnalyzing ? 'bg-green-500' : 'bg-green-500/40'}`} />
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
                    <button onClick={handlePredict} disabled={isAnalyzing} className="h-16 rounded-2xl bg-green-600 text-white font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-95 transition-all shadow-lg hover:bg-green-700 disabled:opacity-50">
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

        <AnimatePresence>
            {isInitialLoading && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-md">
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="w-[130px] h-[80px] bg-zinc-900/90 border border-green-500/30 rounded-xl p-2 flex flex-col items-center justify-center gap-2 shadow-[0_0_30px_rgba(34,197,94,0.2)]"
                    >
                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                            <motion.div 
                                className="h-full bg-green-500"
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 3, ease: "linear" }}
                            />
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <p className="text-[7px] font-bold text-white uppercase tracking-tight leading-tight">
                                {loadingStep === 0 && (language === 'ar' ? 'جار الاتصال بالسيرفر ...' : 'Connecting to server...')}
                                {loadingStep === 1 && (language === 'ar' ? 'تم الاتصال بالسيرفر' : 'Connected to server')}
                                {loadingStep === 2 && (language === 'ar' ? 'جار الاتصال بالid الخاص بك' : 'Connecting to your ID...')}
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    </div>
  );
};
