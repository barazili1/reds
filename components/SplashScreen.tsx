import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Language } from '../utils/translations';
import { ShieldCheck, Globe, Cpu, Zap, Activity, Sparkles } from 'lucide-react';

const MotionDiv = motion.div as any;

interface SplashScreenProps {
  onComplete: () => void;
  language?: Language;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete, language = 'en' }) => {
  const [progress, setProgress] = useState(0);
  const [exit, setExit] = useState(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const duration = 4000;
    const startTime = Date.now();

    const timer = setInterval(() => {
      const now = Date.now();
      const elapsed = now - startTime;
      const calculatedProgress = Math.min((elapsed / duration) * 100, 100);
      
      setProgress(calculatedProgress);

      if (calculatedProgress >= 100) {
        clearInterval(timer);
        setTimeout(() => setExit(true), 500);
        setTimeout(() => {
          onCompleteRef.current();
        }, 1200);
      }
    }, 30);

    return () => clearInterval(timer);
  }, []); 

  const isArabic = language === 'ar';
  const logoUrl = "https://www.image2url.com/r2/default/images/1776207454999-cea10406-23d7-4372-b0ff-3f6d143a9715.jpeg";

  const loadingSteps = isArabic ? [
    "تأمين الاتصال...",
    "مزامنة البيانات...",
    "تحسين الأداء...",
    "النظام جاهز"
  ] : [
    "SECURING CONNECTION...",
    "SYNCING DATA...",
    "OPTIMIZING PERFORMANCE...",
    "SYSTEM READY"
  ];

  const currentStep = Math.min(Math.floor((progress / 100) * loadingSteps.length), loadingSteps.length - 1);

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center transition-all duration-1000 ease-in-out 
      bg-[#030305] overflow-hidden
      ${exit ? 'opacity-0 scale-105' : 'opacity-100 scale-100'} 
      ${isArabic ? 'font-ar' : ''}`}>
      
      {/* Background Ambient Glows */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-[30%] left-[40%] w-[20%] h-[20%] bg-cyan-500/5 blur-[80px] rounded-full" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 0.3, 0],
              scale: [0, 1, 0],
              x: [Math.random() * 100 - 50, Math.random() * 100 - 50],
              y: [Math.random() * 100 - 50, Math.random() * 100 - 50]
            }}
            transition={{ 
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{ 
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>

      {/* Central Content */}
      <div className="relative z-10 flex flex-col items-center w-full px-6">
        <MotionDiv 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
          className="relative mb-12"
        >
          {/* Logo Aura */}
          <div className="absolute -inset-12 bg-gradient-to-tr from-blue-600/20 to-cyan-400/20 blur-[60px] rounded-full animate-pulse" />
          
          {/* Rotating Border */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-4 border border-white/5 rounded-[3rem]"
          />

          {/* Logo Container */}
          <div className="relative w-40 h-40 rounded-[2.5rem] overflow-hidden border border-white/10 bg-zinc-900 shadow-2xl">
            <img 
              src={logoUrl} 
              className="w-full h-full object-cover" 
              alt="logo" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Shimmer Effect */}
            <motion.div 
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
            />
          </div>

          {/* Floating Status Icons */}
          <MotionDiv 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-6 -right-6 w-12 h-12 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-xl"
          >
            <ShieldCheck className="w-6 h-6 text-blue-400" />
          </MotionDiv>
          
          <MotionDiv 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute -bottom-6 -left-6 w-12 h-12 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-xl"
          >
            <Zap className="w-6 h-6 text-cyan-400" />
          </MotionDiv>
        </MotionDiv>

        {/* Brand Name */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-1"
          >
            <h1 className="text-4xl font-black text-white tracking-[0.2em] uppercase">
              APPLE <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">HACK</span>
            </h1>
            <div className="flex items-center justify-center gap-3">
              <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-blue-500/50" />
              <Sparkles className="w-3 h-3 text-blue-400 animate-pulse" />
              <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-blue-500/50" />
            </div>
          </motion.div>

          {/* Status Text */}
          <div className="h-6">
            <AnimatePresence mode="wait">
              <motion.p 
                key={currentStep}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em]"
              >
                {loadingSteps[currentStep]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="absolute bottom-20 w-full max-w-[280px] space-y-4">
        <div className="flex justify-between items-end px-1">
          <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
            {isArabic ? "تحميل النظام" : "System Load"}
          </span>
          <span className="text-xl font-black text-white italic">
            {Math.round(progress)}%
          </span>
        </div>
        
        <div className="relative h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>

        {/* Bottom Decorative Elements */}
        <div className="flex justify-center gap-2">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                opacity: progress > (i + 1) * 20 ? 1 : 0.2,
                scale: progress > (i + 1) * 20 ? 1.2 : 1
              }}
              className="w-1 h-1 rounded-full bg-blue-500"
            />
          ))}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@900&display=swap');
        .font-ar {
          font-family: 'Inter', sans-serif;
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
