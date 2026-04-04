
import React, { useState, useEffect, useRef } from 'react';
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
  const [statusText, setStatusText] = useState("LOCATING NODE...");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const platforms = [
    {
      id: 'linebet_v1' as Platform,
      name: 'LINEBET V1',
      img: 'https://image2url.com/r2/default/images/1775220016764-cefe3d7b-9bc6-464b-a2ad-62153c543288.png',
      tagline: 'STRATEGIC NODE: ALPHA',
      status: 'OPTIMIZED',
      latency: '14ms',
      geo: 'GLOBAL',
      ip: '192.168.1.104'
    },
    {
      id: 'linebet_v2' as Platform,
      name: 'LINEBET V2',
      img: 'https://image2url.com/r2/default/images/1775220016764-cefe3d7b-9bc6-464b-a2ad-62153c543288.png',
      tagline: 'STRATEGIC NODE: BRAVO',
      status: 'VERIFIED',
      latency: '18ms',
      geo: 'REGIONAL',
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
          
          if (next < 25) setStatusText("ESTABLISHING HANDSHAKE...");
          else if (next < 50) setStatusText("BYPASSING FIREWALL...");
          else if (next < 75) setStatusText("SYNCING VIP DATABASE...");
          else if (next < 95) setStatusText("OPTIMIZING ANALYTICS...");
          else setStatusText("CONNECTION SECURED");

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
    <div className="flex flex-col h-full px-6 pt-12 pb-10 overflow-y-auto custom-scrollbar animate-in fade-in duration-1000 relative bg-black">
      {/* Canvas Particle Background */}
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 pointer-events-none z-0 opacity-40"
      />

      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0" 
           style={{ backgroundImage: 'radial-gradient(#22c55e 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
      
      <div className="fixed top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-green-500/30 rounded-tl-xl pointer-events-none z-20"></div>
      <div className="fixed top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-green-500/30 rounded-tr-xl pointer-events-none z-20"></div>
      <div className="fixed bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-green-500/30 rounded-bl-xl pointer-events-none z-20"></div>
      <div className="fixed bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-green-500/30 rounded-br-xl pointer-events-none z-20"></div>

      <div className="text-center mb-10 relative z-10 shrink-0">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-950 border border-green-500/20 mb-6 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
           <Radio className="w-3 h-3 text-green-500 animate-pulse" />
           <span className="text-[9px] font-black text-green-500 tracking-[0.25em] uppercase font-mono">Neural Interface Standby</span>
        </div>
        
        <h2 className="text-5xl font-display font-black text-white tracking-tighter mb-4 leading-none uppercase">
          PROTOCOL<br/><span className="text-green-500 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]">ACCESS</span>
        </h2>
        
        <div className="flex items-center justify-center gap-3 opacity-40">
           <div className="h-[1px] w-8 bg-green-500"></div>
           <p className="text-[10px] text-zinc-400 font-bold tracking-widest uppercase">Target Selection</p>
           <div className="h-[1px] w-8 bg-green-500"></div>
        </div>
      </div>

      <div className="flex flex-col gap-6 mb-10 relative z-10 shrink-0">
        {platforms.map((p, idx) => (
          <button 
            key={p.id}
            onClick={() => handlePlatformSelect(p.id)}
            disabled={isConnecting}
            className={`group relative flex flex-col overflow-hidden rounded-[2rem] border-2 transition-all duration-500 text-left animate-in fade-in slide-in-from-bottom-4 fill-mode-both`}
            style={{ animationDelay: `${idx * 150}ms` }}
          >
            <div className={`absolute inset-0 transition-all duration-500 ${
              selected === p.id 
                ? 'bg-zinc-950 opacity-100' 
                : 'bg-zinc-900/10 opacity-100 group-hover:bg-zinc-900/30'
            }`} />
            
            <div className={`absolute inset-0 border-2 transition-all duration-500 rounded-[2rem] ${
              selected === p.id 
                ? 'border-green-500 shadow-[0_0_50px_rgba(34,197,94,0.25)] scale-[1.02]' 
                : 'border-zinc-900 group-hover:border-zinc-700 hover:scale-[1.01]'
            }`} />

            {selected === p.id && (
              <div 
                className="absolute inset-x-0 h-[1px] bg-green-500/50 shadow-[0_0_15px_#22c55e] z-30 pointer-events-none opacity-50"
                style={{ top: `${scanLinePos}%` }}
              />
            )}

            <div className="flex items-center p-6 gap-6 relative z-10 transition-transform duration-500 group-active:scale-[0.98]">
              <div className={`relative w-28 h-28 rounded-2xl overflow-hidden shrink-0 border-2 transition-all duration-500 ${selected === p.id ? 'border-green-500 shadow-lg' : 'border-zinc-800 grayscale opacity-50 group-hover:opacity-80 group-hover:grayscale-0'}`}>
                <img 
                  src={p.img} 
                  alt={p.name} 
                  className={`w-full h-full object-cover transition-transform duration-1000 ${selected === p.id ? 'scale-110' : 'scale-100 group-hover:scale-105'}`} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className={`absolute bottom-2 inset-x-2 py-0.5 rounded-md text-[7px] font-black text-center uppercase tracking-tighter ${selected === p.id ? 'bg-green-500 text-black' : 'bg-zinc-800 text-zinc-400'}`}>
                   {p.status}
                </div>
              </div>
              
              <div className="flex-1 space-y-3 min-w-0 transition-all duration-500">
                <div className="flex items-center justify-between">
                   <h3 className={`text-3xl font-display font-black tracking-tighter transition-colors ${selected === p.id ? 'text-white' : 'text-zinc-600 group-hover:text-zinc-300'}`}>{p.name}</h3>
                   {selected === p.id && <Zap className="w-5 h-5 text-green-500 fill-green-500 animate-pulse" />}
                </div>
                
                <div className="space-y-2">
                   <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 bg-zinc-900 rounded-full overflow-hidden">
                         <div className={`h-full bg-green-500 transition-all duration-1000 ${selected === p.id ? 'w-full' : 'w-0'}`}></div>
                      </div>
                      <span className="text-[8px] font-mono text-zinc-500 tracking-tighter">{p.latency}</span>
                   </div>
                   
                   <div className="flex justify-between items-center opacity-60">
                      <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">{p.tagline}</span>
                      <div className="flex items-center gap-1">
                         <Globe className="w-2.5 h-2.5 text-zinc-500" />
                         <span className="text-[8px] font-mono text-zinc-500">{p.geo}</span>
                      </div>
                   </div>
                </div>
              </div>

              <div className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center transition-all duration-500 ${
                selected === p.id ? 'bg-green-500 border-green-500 text-black shadow-[0_0_20px_rgba(34,197,94,0.4)] rotate-0' : 'border-zinc-800 text-zinc-800 group-hover:border-zinc-600 group-hover:text-zinc-600'
              }`}>
                {selected === p.id ? <Check className="w-7 h-7 stroke-[4px]" /> : <Lock className="w-5 h-5" />}
              </div>
            </div>

            <div className={`px-6 py-2 border-t flex justify-between items-center bg-black/40 transition-colors z-10 ${selected === p.id ? 'border-green-500/20' : 'border-zinc-900 group-hover:border-zinc-800'}`}>
                <div className="flex gap-4">
                   <div className="flex items-center gap-1">
                      <Cpu className={`w-2.5 h-2.5 transition-colors ${selected === p.id ? 'text-green-500' : 'text-zinc-800 group-hover:text-zinc-600'}`} />
                      <span className="text-[7px] font-mono text-zinc-700 group-hover:text-zinc-500">PROC: V.8.2</span>
                   </div>
                   <div className="flex items-center gap-1">
                      <Shield className={`w-2.5 h-2.5 transition-colors ${selected === p.id ? 'text-green-500' : 'text-zinc-800 group-hover:text-zinc-600'}`} />
                      <span className="text-[7px] font-mono text-zinc-700 group-hover:text-zinc-500">SEC: ACTIVE</span>
                   </div>
                </div>
                <div className="flex items-center gap-1">
                   <Target className={`w-2.5 h-2.5 transition-all ${selected === p.id ? 'text-green-500 animate-spin' : 'text-zinc-800 group-hover:text-zinc-600'}`} />
                   <span className="text-[7px] font-mono text-zinc-700 tracking-tighter group-hover:text-zinc-500">BITRATE: 4096 KBPS</span>
                </div>
            </div>
          </button>
        ))}
      </div>

      <div className="relative z-10 shrink-0 mt-auto pb-4">
        <div className={`absolute -inset-4 bg-green-500/10 blur-[40px] rounded-full transition-opacity duration-500 ${selected ? 'opacity-100' : 'opacity-0'}`}></div>
        <button 
          onClick={handleProceed}
          disabled={isConnecting}
          className="relative w-full h-20 rounded-[2.5rem] bg-white text-black font-black font-display text-lg tracking-[0.4em] uppercase flex items-center justify-center gap-4 shadow-[0_20px_40px_rgba(255,255,255,0.1)] hover:bg-zinc-100 active:scale-[0.97] transition-all group overflow-hidden disabled:opacity-50"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-200 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
          <span className="relative z-10">INITIALIZE SESSION</span>
          <ChevronRight className="relative z-10 w-7 h-7 group-hover:translate-x-2 transition-transform duration-300" />
        </button>
      </div>

      {isConnecting && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl animate-in fade-in duration-500 p-6">
           <div className="relative w-full max-sm">
              <div className="absolute -inset-8 bg-green-500/10 blur-[80px] rounded-full animate-pulse"></div>
              
              <div className="relative bg-zinc-950 border-2 border-green-500/20 rounded-[3rem] p-10 overflow-hidden shadow-[0_0_100px_rgba(34,197,94,0.15)] flex flex-col items-center">
                 <div className="absolute top-0 right-0 p-6 opacity-20">
                    <Terminal className="w-8 h-8 text-green-500" />
                 </div>

                 <div className="relative mb-12">
                    <div className="w-24 h-24 bg-zinc-900 border-2 border-green-500/30 rounded-[2rem] flex items-center justify-center relative z-10">
                       <Wifi className="w-12 h-12 text-green-500 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse" />
                    </div>
                    <div className="absolute -inset-4 border border-dashed border-green-500/10 rounded-full animate-[spin_15s_linear_infinite]"></div>
                    <div className="absolute -inset-8 border border-dotted border-green-500/5 rounded-full animate-[spin_25s_linear_infinite_reverse]"></div>
                 </div>

                 <div className="text-center mb-10 w-full">
                    <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.4em] mb-3">Target Node Connection</h3>
                    <h2 className="text-4xl font-display font-black text-white tracking-tighter uppercase mb-2">
                       {selectedNode.name}
                    </h2>
                    <div className="flex items-center justify-center gap-2 mb-8">
                       <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping"></div>
                       <span className="text-[9px] font-mono text-green-500 font-bold tracking-widest uppercase">
                          IP: {selectedNode.ip}
                       </span>
                    </div>

                    <div className="space-y-4">
                       <div className="flex justify-between items-end px-1">
                          <span className="text-[10px] font-black text-white tracking-widest font-mono animate-pulse uppercase">
                             {statusText}
                          </span>
                          <span className="text-[14px] font-black text-green-500 font-display">
                             {Math.round(progress)}%
                          </span>
                       </div>
                       
                       <div className="h-4 w-full bg-zinc-900/50 rounded-full border border-white/5 overflow-hidden p-1 shadow-inner relative">
                          <div 
                            className="h-full bg-gradient-to-r from-green-600 to-green-400 rounded-full transition-all duration-100 ease-out relative shadow-[0_0_15px_rgba(34,197,94,0.5)]"
                            style={{ width: `${progress}%` }}
                          >
                             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]"></div>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="w-full p-4 bg-black/40 border border-zinc-900 rounded-2xl flex flex-col gap-2">
                    <div className="flex justify-between items-center text-[7px] font-mono text-zinc-600 uppercase tracking-tighter">
                       <span>Socket: Alpha-7</span>
                       <span>Handshake: Secured</span>
                    </div>
                    <div className="flex justify-between items-center text-[7px] font-mono text-zinc-600 uppercase tracking-tighter">
                       <span>Latency: {selectedNode.latency}</span>
                       <span>Packets: 1024b</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

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
