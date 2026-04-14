
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Platform } from '../types';
import { Check, ChevronRight, Zap, Lock, Shield, Globe, Cpu, Radio, Target, Terminal, Wifi } from 'lucide-react';
import { audioManager } from '../utils/audioManager';

interface PlatformSelectionProps {
  onSelect: (platform: Platform) => void;
  t: any;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

const PlatformSelection: React.FC<PlatformSelectionProps> = ({ onSelect, t }) => {
  const [selected, setSelected] = useState<Platform>('linebet_v1');
  const [scanLinePos, setScanLinePos] = useState(0);
  const [isConnecting, setIsConnecting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("تحديد موقع العقدة...");
  const [onlineUsers, setOnlineUsers] = useState(Math.floor(Math.random() * (2500 - 1800) + 1800));
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const platforms = [
    {
      id: 'linebet_v1' as Platform,
      name: 'WINWIN',
      img: 'https://www.image2url.com/r2/default/images/1776200504700-76a44e57-f905-48c8-b91c-bd0939ae4633.jpeg',
      tagline: 'عقدة استراتيجية: ألفا',
      status: 'محسن',
      latency: '14ms',
      geo: 'عالمي',
      ip: '192.168.1.104'
    },
    {
      id: 'linebet_v2' as Platform,
      name: 'GOOBET',
      img: 'https://www.image2url.com/r2/default/images/1776200548040-627ffa09-024d-4f16-9b09-e24dc2f6b697.png',
      tagline: 'عقدة استراتيجية: برافو',
      status: 'مؤكد',
      latency: '18ms',
      geo: 'إقليمي',
      ip: '172.16.254.1'
    }
  ];

  const selectedNode = platforms.find(p => p.id === selected) || platforms[0];

  // Particle Background Logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const particleCount = 40;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = 'rgba(34, 197, 94, 0.15)';
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.05)';
      ctx.lineWidth = 0.5;

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Lines between particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 150) {
            ctx.globalAlpha = 1 - dist / 150;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineUsers(prev => {
        const change = Math.floor(Math.random() * 11) - 5; // -5 to +5
        const next = prev + change;
        return Math.max(1500, Math.min(3000, next));
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanLinePos(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isConnecting) {
      const duration = 4000;
      const interval = 40;
      const totalSteps = duration / interval;
      const stepValue = 100 / totalSteps;

      const timer = setInterval(() => {
        setProgress(prev => {
          const next = prev + stepValue;
          
          if (next < 25) setStatusText("بدء المصافحة...");
          else if (next < 50) setStatusText("تجاوز جدار الحماية...");
          else if (next < 75) setStatusText("مزامنة قاعدة البيانات...");
          else if (next < 95) setStatusText("تحسين التحليلات...");
          else setStatusText("تم تأمين الاتصال");

          if (next >= 100) {
            clearInterval(timer);
            return 100;
          }
          return next;
        });
      }, interval);

      const finishTimer = setTimeout(() => {
        onSelect(selected);
      }, duration + 500);

      return () => {
        clearInterval(timer);
        clearTimeout(finishTimer);
      };
    }
  }, [isConnecting, onSelect, selected]);

  const handleProceed = () => {
    audioManager.playClick();
    setIsConnecting(true);
  };

  const handlePlatformSelect = (id: Platform) => {
    if (!isConnecting) {
      audioManager.playClick();
      setSelected(id);
    }
  };

  return (
    <div className="flex flex-col relative bg-[#020202] font-mono">
      {/* Background Matrix/Grid Layer */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--primary-color-rgb),0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--primary-color-rgb),0.1)_1px,transparent_1px)] bg-[size:30px_30px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-green-500/5 via-transparent to-green-500/5" />
      </div>

      {/* Header Section - Redesigned to Compact Pill Shape */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
        <header className="flex items-center gap-3 px-5 py-1.5 bg-zinc-900/90 backdrop-blur-xl border border-green-500/30 rounded-full shadow-[0_0_15px_rgba(var(--primary-color-rgb),0.2)]">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_var(--primary-color)] animate-pulse" />
          <span className="text-[9px] text-white/70 font-black tracking-widest uppercase">المتصلين:</span>
          <span className="text-sm text-green-500 font-mono font-black tabular-nums tracking-tight">
            {onlineUsers.toLocaleString()}
          </span>
        </header>
      </div>

      {/* Main Selection Area - Dual Core Layout */}
      <main className="relative z-10 flex flex-col items-center px-6 gap-12 pt-32">
        <div className="grid grid-cols-1 gap-12 w-full max-w-sm">
          {platforms.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => handlePlatformSelect(p.id)}
              disabled={isConnecting}
              className="relative group outline-none"
            >
              {/* Selection Ring */}
              <AnimatePresence>
                {selected === p.id && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
                    animate={{ opacity: 1, scale: 1.1, rotate: 360 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-8 border border-dashed border-green-500/20 rounded-full pointer-events-none"
                  />
                )}
              </AnimatePresence>

              <div className={`relative flex items-center gap-6 p-6 rounded-[2rem] border-2 transition-all duration-500 ${
                selected === p.id 
                  ? 'bg-green-500/5 border-green-500 shadow-[0_0_40px_rgba(34,197,94,0.15)]' 
                  : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700'
              }`}>
                {/* Hexagon/Circle Image Container */}
                <div className="relative shrink-0">
                  <div className={`w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all duration-500 ${
                    selected === p.id ? 'border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.4)]' : 'border-zinc-800 grayscale opacity-40'
                  }`}>
                    <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  </div>
                  
                  {/* Status Indicator Dot */}
                  <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-black flex items-center justify-center ${
                    selected === p.id ? 'bg-green-500' : 'bg-zinc-800'
                  }`}>
                    {selected === p.id && <Check className="w-2 h-2 text-black stroke-[4px]" />}
                  </div>
                </div>

                <div className="flex-1 text-left space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-2xl font-black tracking-tighter transition-colors ${
                      selected === p.id ? 'text-white' : 'text-zinc-600'
                    }`}>{p.name}</h3>
                    <span className={`text-[8px] font-mono px-2 py-0.5 rounded border ${
                      selected === p.id ? 'border-green-500/40 text-green-500' : 'border-zinc-800 text-zinc-800'
                    }`}>{p.latency}</span>
                  </div>
                  <p className={`text-[9px] uppercase tracking-widest font-bold transition-colors ${
                    selected === p.id ? 'text-green-500/60' : 'text-zinc-800'
                  }`}>{p.tagline}</p>
                  
                  {/* Technical Mini-Graph */}
                  <div className="flex gap-1 h-3 items-end">
                    {[...Array(8)].map((_, i) => (
                      <motion.div 
                        key={i}
                        animate={{ height: selected === p.id ? [4, 12, 6, 10, 4] : 4 }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                        className={`w-1 rounded-full ${selected === p.id ? 'bg-green-500' : 'bg-zinc-900'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Decorative Coordinates */}
              <div className="absolute -bottom-4 left-8 flex gap-4 opacity-20">
                <span className="text-[6px] text-green-500">X: {idx * 142}.22</span>
                <span className="text-[6px] text-green-500">Y: {idx * 89}.45</span>
              </div>
            </button>
          ))}
        </div>
      </main>

      {/* Footer / Action Area */}
      <footer className="relative z-10 p-8 pb-12 shrink-0">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center px-2">
            <div className="flex flex-col">
              <span className="text-[8px] text-zinc-500 uppercase tracking-widest">العقدة النشطة</span>
              <span className="text-[10px] text-white font-black uppercase tracking-widest">
                {selectedNode.name}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[8px] text-zinc-500 uppercase tracking-widest">الحالة</span>
              <div className="flex items-center gap-1.5 justify-end">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] text-green-500 font-black uppercase tracking-widest">جاهز</span>
              </div>
            </div>
          </div>

          <button 
            onClick={handleProceed}
            disabled={isConnecting}
            className="group relative w-full h-20 rounded-2xl bg-green-500 text-black font-black text-lg tracking-[0.2em] uppercase flex items-center justify-center gap-4 overflow-hidden transition-all active:scale-95 disabled:opacity-50 shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)]"
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <span className="relative z-10 transition-colors">اختيار المنصه</span>
            <ChevronRight className="relative z-10 w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
          </button>

          <div className="flex justify-center gap-8 opacity-20">
            <div className="flex items-center gap-2">
              <Terminal className="w-3 h-3 text-green-500" />
              <span className="text-[7px] uppercase tracking-widest">وصول المحطة</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-3 h-3 text-green-500" />
              <span className="text-[7px] uppercase tracking-widest">ارتباط آمن</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Connection dialog removed per request */}

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};

export default PlatformSelection;
