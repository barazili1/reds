import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Language } from '../utils/translations';

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
    const duration = 4500;
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
  const logoUrl = "https://image2url.com/r2/default/images/1775220016764-cefe3d7b-9bc6-464b-a2ad-62153c543288.png";

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center transition-all duration-1000 ease-in-out 
      bg-[#050505] overflow-hidden
      ${exit ? 'opacity-0 scale-110' : 'opacity-100 scale-100'} 
      ${isArabic ? 'font-ar' : ''}`}>
      
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-green-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-green-500/5 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
      </div>

      <div className="relative z-10 flex flex-col items-center w-full px-6 flex-1 justify-center">
        {/* Central Logo with Glow */}
        <MotionDiv 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-12"
        >
          <div className="absolute inset-0 bg-green-500/20 blur-[60px] rounded-full animate-pulse" />
          <div className="relative w-40 h-40 overflow-hidden rounded-[3rem] border border-green-500/30 bg-black shadow-[0_0_60px_rgba(34,197,94,0.1)]">
            <img 
              src={logoUrl} 
              alt="Logo"
              className="w-full h-full object-cover select-none transform hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
          
          {/* Platform Icons Floating Around (Luxurious Touch) */}
          <MotionDiv 
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-6 -right-6 w-12 h-12 rounded-xl bg-black/80 backdrop-blur-md border border-green-500/40 p-2 shadow-2xl"
          >
            <img src="https://image2url.com/r2/default/images/1775220016764-cefe3d7b-9bc6-464b-a2ad-62153c543288.png" className="w-full h-full object-contain rounded-lg" alt="linebet" />
          </MotionDiv>
          <MotionDiv 
            animate={{ 
              y: [0, 10, 0],
              rotate: [0, -5, 0]
            }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-6 -left-6 w-12 h-12 rounded-xl bg-black/80 backdrop-blur-md border border-green-500/40 p-2 shadow-2xl"
          >
            <img src="https://image2url.com/r2/default/images/1775220016764-cefe3d7b-9bc6-464b-a2ad-62153c543288.png" className="w-full h-full object-contain rounded-lg" alt="linebet" />
          </MotionDiv>
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
          className="text-center"
        >
          <h1 className="text-2xl font-black text-white tracking-[0.5em] uppercase italic mb-2">
            SANFOR <span className="text-green-500">VIP</span>
          </h1>
          <div className="h-[1px] w-20 bg-gradient-to-r from-transparent via-green-500/50 to-transparent mx-auto mb-4" />
          <p className="text-[9px] font-mono text-green-500/60 uppercase tracking-[0.4em] font-bold">Elite Matrix Intelligence</p>
        </MotionDiv>
      </div>

      {/* PROGRESS SECTION */}
      <div className="pb-32 flex flex-col items-center gap-6 w-full max-w-[240px] relative z-10">
        <div className="flex justify-between w-full px-4">
          <span className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.3em]">Establishing Link</span>
          <span className="text-[10px] font-mono text-green-500 font-bold">{Math.round(progress)}%</span>
        </div>
        <div className="relative w-full h-[1px] bg-zinc-900 rounded-full overflow-hidden">
          <MotionDiv 
            className="h-full bg-gradient-to-r from-green-600 via-green-400 to-green-600"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        <div className="flex gap-4">
          <div className="w-1 h-1 rounded-full bg-green-500/40 animate-ping" />
          <div className="w-1 h-1 rounded-full bg-green-500/40 animate-ping delay-300" />
          <div className="w-1 h-1 rounded-full bg-green-500/40 animate-ping delay-700" />
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
