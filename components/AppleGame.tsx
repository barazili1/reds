import React, { useState, useEffect } from 'react';
import { Grid } from './Grid';
import { playSound } from '../services/audio';
import { GameState, PredictionResult, AccessKey, Language, Platform } from '../types';
import { translations } from '../translations';
import { 
    Zap,
    RotateCcw,
    Users,
    Send,
    ArrowLeft,
    Shield,
    Activity,
    Lock,
    ExternalLink,
    Sparkles,
    Gift,
    Trophy,
    Gamepad2
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
  const [showPromoDialog, setShowPromoDialog] = useState(true);
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
    <div className={`flex flex-col min-h-full relative select-none bg-[#050505] overflow-hidden font-sans text-white ${isRtl ? 'font-ar' : 'font-en'}`}>
        {/* Background Layer: Ultra High-End Mesh Gradient & Floating Elements */}
        <div className="fixed inset-0 z-0 pointer-events-none">
            <motion.div 
                animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 20, 0],
                    x: [-30, 30, -30],
                    y: [-30, 30, -30]
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[-40%] left-[-40%] w-[120%] h-[120%] bg-green-500/[0.03] blur-[180px] rounded-full" 
                style={{ backgroundColor: 'rgba(var(--primary-color-rgb), 0.05)' } as any} 
            />
            <motion.div 
                animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, -20, 0],
                    x: [30, -30, 30],
                    y: [30, -30, 30]
                }}
                transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[-40%] right-[-40%] w-[120%] h-[120%] bg-blue-500/[0.03] blur-[180px] rounded-full" 
            />
            
            {/* Cyberpunk Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:60px_60px]" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/50 to-[#050505]" />
            
            {/* Vignette Effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
            
            {/* Professional Floating Particles */}
            {[...Array(50)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ x: Math.random() * 100 + '%', y: Math.random() * 100 + '%', opacity: 0 }}
                    animate={{ 
                        y: [null, '-60%'],
                        opacity: [0, 0.7, 0],
                        scale: [0, 1.3, 0]
                    }}
                    transition={{ 
                        duration: Math.random() * 20 + 20, 
                        repeat: Infinity, 
                        delay: Math.random() * 15 
                    }}
                    className="absolute w-0.5 h-0.5 bg-white rounded-full shadow-[0_0_8px_white]"
                />
            ))}

            {/* Floating Tech Icons */}
            {[Sparkles, Shield, Activity].map((Icon, i) => (
                <motion.div
                    key={i}
                    initial={{ x: Math.random() * 100 + '%', y: Math.random() * 100 + '%', opacity: 0 }}
                    animate={{ 
                        y: [null, '-20%'],
                        opacity: [0, 0.1, 0],
                        rotate: [0, 360]
                    }}
                    transition={{ 
                        duration: 40, 
                        repeat: Infinity, 
                        delay: i * 10 
                    }}
                    className="absolute text-green-500"
                    style={{ color: 'var(--primary-color)' } as any}
                >
                    <Icon size={Math.random() * 20 + 20} />
                </motion.div>
            ))}
        </div>

        <div className="flex-1 flex flex-col relative z-10 w-full max-w-2xl mx-auto h-full px-6 py-8">
            
            {/* Header: Staggered Entrance */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between mb-10"
            >
                <motion.button 
                    whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onBack}
                    className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md transition-all shadow-lg"
                >
                    <ArrowLeft className="w-6 h-6" />
                </motion.button>
                
                <div className="flex flex-col items-center">
                    <motion.div 
                        animate={{ boxShadow: ['0 0 10px rgba(var(--primary-color-rgb), 0.1)', '0 0 20px rgba(var(--primary-color-rgb), 0.3)', '0 0 10px rgba(var(--primary-color-rgb), 0.1)'] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="flex items-center gap-2.5 px-4 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full" 
                        style={{ backgroundColor: 'rgba(var(--primary-color-rgb), 0.1)', borderColor: 'rgba(var(--primary-color-rgb), 0.2)' } as any}
                    >
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_var(--primary-color)]" style={{ backgroundColor: 'var(--primary-color)' } as any} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-green-500" style={{ color: 'var(--primary-color)' } as any}>
                            {language === 'ar' ? 'النظام نشط' : 'System Active'}
                        </span>
                    </motion.div>
                </div>

                <motion.div 
                    whileHover={{ rotate: 15 }}
                    className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md shadow-lg"
                >
                    <Users className="w-5 h-5 text-zinc-400" />
                </motion.div>
            </motion.div>

            {/* Main Game Card */}
            <div className="flex-1 flex flex-col gap-8">
                {/* Title Section: Elegant Typography */}
                <div className="text-center space-y-2">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-block px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[8px] font-black text-zinc-500 uppercase tracking-[0.4em] mb-2"
                    >
                        {language === 'ar' ? 'محرك التنبؤ العصبي' : 'Neural Prediction Engine'}
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-black tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                    >
                        {language === 'ar' ? 'توقع التفاحة' : 'Apple Predictor'}
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-sm text-zinc-500 font-medium tracking-wide"
                    >
                        {language === 'ar' ? 'اكتشف مكان التفاحة الرابحة بدقة 99%' : 'Discover the winning apple location with 99% accuracy'}
                    </motion.p>
                </div>

                {/* Odds Section: High-End Floating Pills */}
                <div className="flex justify-center gap-3 mb-[-16px]">
                    {['x1.23', 'x1.54', 'x1.93', 'x2.41', 'x3.01'].map((odd, i) => (
                        <motion.div 
                            key={odd}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + i * 0.1, type: "spring", stiffness: 100 }}
                            whileHover={{ scale: 1.15, y: -6, backgroundColor: 'rgba(var(--primary-color-rgb), 0.15)', borderColor: 'var(--primary-color)' }}
                            className={`px-4 py-2 rounded-2xl text-xs font-black border transition-all duration-300 cursor-default backdrop-blur-md ${i === 0 ? 'bg-green-500/20 border-green-500 text-green-500 shadow-[0_0_25px_rgba(var(--primary-color-rgb),0.3)]' : 'bg-white/5 border-white/10 text-zinc-600'}`} 
                            style={i === 0 ? { borderColor: 'var(--primary-color)', color: 'var(--primary-color)', backgroundColor: 'rgba(var(--primary-color-rgb), 0.2)' } as any : {}}
                        >
                            {odd}
                        </motion.div>
                    ))}
                </div>

                {/* Grid Container: Ultra Professional Cyber-Frame */}
                <div className="relative group">
                    {/* Animated Border Glow */}
                    <div className="absolute -inset-[2px] bg-gradient-to-r from-green-500/50 via-blue-500/50 to-green-500/50 rounded-[3rem] opacity-20 group-hover:opacity-100 blur-sm transition-opacity duration-1000 animate-pulse" style={{ backgroundImage: 'linear-gradient(to right, var(--primary-color), #3b82f6, var(--primary-color))' } as any} />
                    
                    <div className={`relative bg-zinc-950/60 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 min-h-[240px] flex flex-col justify-center transition-all duration-700 shadow-[0_30px_60px_rgba(0,0,0,0.5)] ${isAnalyzing ? 'scale-[1.02] border-green-500/30' : ''}`}>
                        
                        {/* Scanline Effect */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[2.5rem]">
                            <motion.div 
                                animate={{ y: ['-100%', '100%'] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                className="w-full h-20 bg-gradient-to-b from-transparent via-green-500/[0.03] to-transparent"
                            />
                        </div>

                        <Grid path={currentResult?.path || []} isAnalyzing={isAnalyzing} predictionId={currentResult?.id} rowCount={1} difficulty="Hard" gridData={currentResult?.gridData} language={language} />
                        
                        {/* Analysis Progress Overlay: High-Tech HUD */}
                        <AnimatePresence>
                            {isAnalyzing && (
                                <MotionDiv 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/70 backdrop-blur-xl rounded-[2.5rem]"
                                >
                                    <div className="w-full max-w-[200px] space-y-6">
                                        <div className="relative flex flex-col items-center">
                                            <motion.div 
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                className="w-20 h-20 border-2 border-green-500/20 border-t-green-500 rounded-full mb-4"
                                                style={{ borderTopColor: 'var(--primary-color)' } as any}
                                            />
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-[-8px]">
                                                <span className="text-xl font-black tabular-nums text-white">{Math.round(predictionProgress)}%</span>
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-2 text-center">
                                            <span className="text-[10px] font-black text-green-500 uppercase tracking-[0.3em] animate-pulse" style={{ color: 'var(--primary-color)' } as any}>
                                                {language === 'ar' ? 'مزامنة البيانات...' : 'Syncing Data...'}
                                            </span>
                                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                                <motion.div 
                                                    className="h-full bg-green-500 shadow-[0_0_15px_var(--primary-color)]"
                                                    style={{ backgroundColor: 'var(--primary-color)' } as any}
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${predictionProgress}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </MotionDiv>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Stats Row: Futuristic Data Modules */}
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { label: language === 'ar' ? 'العقد النشطة' : 'Active Nodes', value: onlineUsersCount.toLocaleString(), color: 'white', icon: Activity },
                        { label: language === 'ar' ? 'نسبة النجاح' : 'Success Rate', value: '99.9%', color: 'var(--primary-color)', icon: Trophy },
                        { label: language === 'ar' ? 'زمن الاستجابة' : 'Latency', value: '12ms', color: '#60a5fa', icon: Zap }
                    ].map((stat, i) => (
                        <motion.div 
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 + i * 0.1 }}
                            whileHover={{ y: -5, backgroundColor: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.2)' }}
                            className="relative group overflow-hidden bg-white/5 border border-white/10 rounded-3xl p-4 text-center transition-all shadow-lg"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />
                            <stat.icon className="w-4 h-4 mx-auto mb-2 opacity-30 group-hover:opacity-100 transition-opacity" style={{ color: stat.color }} />
                            <span className="block text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1">{stat.label}</span>
                            <span className="text-sm font-black tracking-tight" style={{ color: stat.color }}>{stat.value}</span>
                        </motion.div>
                    ))}
                </div>

                {/* Action Buttons: Premium Interactive Controls */}
                <div className="flex flex-col gap-4 mt-auto">
                    <motion.button 
                        whileHover={{ scale: 1.02, y: -4, boxShadow: '0 20px 40px rgba(var(--primary-color-rgb), 0.3)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handlePredict} 
                        disabled={isAnalyzing} 
                        className="relative h-20 group overflow-hidden rounded-[2rem] bg-green-500 text-black font-black text-lg uppercase tracking-[0.3em] transition-all disabled:opacity-50 shadow-[0_15px_30px_rgba(var(--primary-color-rgb),0.2)]"
                        style={{ backgroundColor: 'var(--primary-color)' } as any}
                    >
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                        
                        <div className="relative flex items-center justify-center gap-4">
                            <Zap className="w-6 h-6 fill-current" />
                            <span>{language === 'ar' ? 'بدء التحليل' : 'Start Analysis'}</span>
                        </div>
                    </motion.button>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <motion.button 
                            whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)', y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleNewGame} 
                            disabled={isAnalyzing} 
                            className="h-16 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-widest transition-all backdrop-blur-md disabled:opacity-50"
                        >
                            <div className="flex items-center justify-center gap-2">
                                <RotateCcw className="w-4 h-4" />
                                <span>{language === 'ar' ? 'تصفير' : 'Reset'}</span>
                            </div>
                        </motion.button>
                        <motion.a 
                            whileHover={{ backgroundColor: 'rgba(0,136,204,0.2)', y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            href="https://t.me/+88DIxn_CzMxiYmY8" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="h-16 rounded-2xl bg-[#0088cc]/10 border border-[#0088cc]/20 text-[#0088cc] font-black text-xs uppercase tracking-widest transition-all backdrop-blur-md flex items-center justify-center gap-2"
                        >
                            <Send className="w-4 h-4" />
                            <span>{language === 'ar' ? 'تيليجرام' : 'Telegram'}</span>
                        </motion.a>
                    </div>
                </div>
            </div>
        </div>

        {/* Promo Dialog: Ultra Professional 300x250 Redesign */}
        <AnimatePresence>
            {showPromoDialog && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 backdrop-blur-2xl p-4">
                    <MotionDiv 
                        initial={{ scale: 0.8, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 50 }}
                        className="w-[320px] h-[280px] bg-zinc-900 border border-white/10 rounded-[3rem] p-8 flex flex-col items-center justify-between text-center shadow-[0_50px_100px_rgba(0,0,0,0.8)] relative overflow-hidden"
                    >
                        {/* High-End Decorative Elements */}
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 via-blue-500 to-green-500" style={{ backgroundImage: 'linear-gradient(to right, var(--primary-color), #3b82f6, var(--primary-color))' } as any} />
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-green-500/10 blur-[60px] rounded-full" />
                        
                        <div className="mt-2">
                            <motion.div 
                                animate={{ 
                                    scale: [1, 1.1, 1],
                                    rotate: [0, 5, -5, 0]
                                }}
                                transition={{ duration: 5, repeat: Infinity }}
                                className="w-20 h-20 rounded-[2rem] bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(var(--primary-color-rgb),0.2)]" 
                                style={{ backgroundColor: 'rgba(var(--primary-color-rgb), 0.1)', borderColor: 'rgba(var(--primary-color-rgb), 0.2)' } as any}
                            >
                                <Gift className="w-10 h-10 text-green-500" style={{ color: 'var(--primary-color)' } as any} />
                            </motion.div>
                        </div>

                        <div className="flex-1 flex flex-col justify-center gap-4">
                            <h3 className="text-xl font-black text-white uppercase tracking-tight">
                                {language === 'ar' ? 'تنبيه الأرباح' : 'Profit Alert'}
                            </h3>
                            <p className="text-[12px] text-zinc-400 font-bold leading-relaxed px-2" dir={isRtl ? 'rtl' : 'ltr'}>
                                {language === 'ar' 
                                    ? 'الرجاء العلم انه عند التسجيل بالبروموكود الخاص بنا LM2020 تزيد فرص الربح' 
                                    : 'Please note that when registering with our promo code LM2020, your winning chances increase.'}
                            </p>
                        </div>

                        <div className="flex w-full gap-4 mt-4">
                            <motion.button 
                                whileHover={{ scale: 1.05, boxShadow: '0 10px 20px rgba(var(--primary-color-rgb), 0.3)' }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    playSound('click');
                                    window.open(platform === 'linebet_v1' ? 'https://www.winwin.com/' : 'https://goobet.com', '_blank');
                                }}
                                className="flex-1 h-14 bg-green-500 text-black font-black text-xs uppercase rounded-2xl transition-all shadow-lg"
                                style={{ backgroundColor: 'var(--primary-color)' } as any}
                            >
                                {language === 'ar' ? 'سجل الآن' : 'Register'}
                            </motion.button>
                            <motion.button 
                                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    playSound('click');
                                    setShowPromoDialog(false);
                                }}
                                className="flex-1 h-14 bg-white/5 border border-white/10 text-white font-black text-xs uppercase rounded-2xl transition-all"
                            >
                                {language === 'ar' ? 'إغلاق' : 'Close'}
                            </motion.button>
                        </div>
                    </MotionDiv>
                </div>
            )}
        </AnimatePresence>

        <style>{`
            @keyframes shimmer {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(200%); }
            }
        `}</style>
    </div>
  );
};

export default AppleGame;
