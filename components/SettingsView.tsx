
import React, { useState, useEffect } from 'react';
import { Copy, Check, ArrowRight, Download, Smartphone, CreditCard, ShieldCheck, Crown, Fingerprint, Database, Terminal, Server, Activity, Lock } from 'lucide-react';
import { Language } from '../utils/translations';
import { Platform } from '../types';
import { audioManager } from '../utils/audioManager';

interface SettingsViewProps {
  onComplete: (userId: string) => void;
  lang: Language;
  t: any;
  platform: Platform;
}

const SettingsView: React.FC<SettingsViewProps> = ({ onComplete, lang, t, platform }) => {
  const [copied, setCopied] = useState(false);
  const [userId, setUserId] = useState('');
  const [errors, setErrors] = useState<{ userId?: boolean; userIdLength?: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);
  const [statusText, setStatusText] = useState("UPLINKING...");
  
  const platformName = platform === 'linebet_v1' ? 'LINEBET V1' : 'LINEBET V2';
  const platformImg = 'https://image2url.com/r2/default/images/1775220016764-cefe3d7b-9bc6-464b-a2ad-62153c543288.png';

  const linebetDownloadUrl = "https://linebet.com/ar/mobile";
  const xbetDownloadUrl = "https://linebet.com/ar/mobile";

  const [verificationSteps, setVerificationSteps] = useState([
    { id: 'server', label: t.step_server, status: "pending", icon: Server },
    { id: 'deposit', label: t.step_receipt, status: "pending", icon: Database },
    { id: 'id', label: t.step_validating, status: "pending", icon: Fingerprint }
  ]);

  const handleCopy = () => {
    audioManager.playCopy();
    navigator.clipboard.writeText("SNFOR77");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    if (val.length <= 15) {
        setUserId(val);
        if (val.length >= 10) {
             setErrors(prev => ({ ...prev, userId: false, userIdLength: false }));
        }
    }
  };

  const validateAndSubmit = () => {
    audioManager.playClick();
    const trimmedId = userId.trim();
    const isLengthValid = trimmedId.length >= 10 && trimmedId.length <= 15;
    
    const newErrors = {
      userId: !trimmedId,
      userIdLength: !isLengthValid,
    };

    setErrors(newErrors);

    if (!newErrors.userId && !newErrors.userIdLength) {
      setIsSubmitting(true);
      
      const updateStep = (index: number, status: string) => {
        setVerificationSteps(prev => 
          prev.map((step, i) => i === index ? { ...step, status } : step)
        );
      };

      updateStep(0, "active");
      setStatusText("SYSTEM UPLINK...");
      
      const duration = 4500;
      const interval = 30;
      const totalSteps = duration / interval;
      const increment = 100 / totalSteps;

      const timer = setInterval(() => {
        setOverallProgress(prev => {
            const next = prev + increment;
            if (next >= 33 && next < 66 && verificationSteps[0].status !== 'completed') {
                updateStep(0, "completed");
                updateStep(1, "active");
                setStatusText("VERIFYING DEPOSIT...");
            }
            if (next >= 66 && next < 95 && verificationSteps[1].status !== 'completed') {
                updateStep(1, "completed");
                updateStep(2, "active");
                setStatusText("VERIFYING ID...");
            }
            if (next >= 100) {
                updateStep(2, "completed");
                setStatusText("AUTHENTICATED");
                clearInterval(timer);
                return 100;
            }
            return next;
        });
      }, interval);

      setTimeout(() => {
        onComplete(trimmedId);
      }, duration + 800);
    }
  };

  return (
    <div className="flex flex-col h-full px-5 pt-6 pb-24 overflow-y-auto custom-scrollbar relative bg-black">
      <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none"></div>

      <div className="mb-12 text-center relative z-10">
        <div className="inline-flex flex-col items-center">
            <div className="w-20 h-20 mb-6 rounded-3xl bg-zinc-950 border-2 border-blue-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.1)] relative">
                <Crown className="w-10 h-10 text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                <div className="absolute inset-0 border border-dashed border-blue-500/10 rounded-3xl animate-[spin_20s_linear_infinite]"></div>
            </div>
            <h2 className="text-4xl font-display font-black text-white tracking-tighter mb-2 uppercase">{t.activation_required}</h2>
            <div className="flex items-center gap-2">
                <div className="h-px w-6 bg-zinc-800"></div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] font-mono">{t.complete_steps}</p>
                <div className="h-px w-6 bg-zinc-800"></div>
            </div>
        </div>
      </div>

      <div className="space-y-6 relative z-10 pb-10">
        <div className="group relative">
           <div className="bg-zinc-950/80 border-2 border-zinc-900 rounded-[2rem] p-6 relative backdrop-blur-xl transition-all duration-300 hover:border-zinc-800">
              <div className="flex items-start justify-between mb-6">
                 <div className="flex gap-4">
                    <div className="w-14 h-14 bg-black rounded-2xl border border-zinc-800 overflow-hidden shadow-2xl">
                       <img src={platformImg} alt={platformName} className="w-full h-full object-cover" />
                    </div>
                    <div>
                       <h3 className="text-lg font-black font-display text-white tracking-tight uppercase leading-none mb-1">{t.install_app}</h3>
                       <span className="text-[9px] font-mono text-blue-500 tracking-[0.2em] uppercase font-bold">Node Integrity: Verified</span>
                    </div>
                 </div>
                 <Smartphone className="w-5 h-5 text-zinc-700" />
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed mb-6 font-medium">{t.install_desc}</p>
              <a 
                href={platform === '1xbet' ? xbetDownloadUrl : linebetDownloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => audioManager.playClick()}
                className="w-full h-12 rounded-xl bg-white text-black font-black font-display text-[10px] tracking-[0.2em] uppercase flex items-center justify-center gap-3 shadow-xl hover:bg-zinc-200 transition-all"
              >
                 <Download className="w-4 h-4" />
                 <span>{t.install_btn}</span>
              </a>
           </div>
        </div>

        <div className="group relative">
           <div className="bg-zinc-950/80 border-2 border-zinc-900 rounded-[2rem] p-6 relative backdrop-blur-xl transition-all duration-300 hover:border-zinc-800">
              <div className="flex items-start justify-between mb-4">
                 <div>
                    <h3 className="text-lg font-black font-display text-white tracking-tight uppercase leading-none mb-1">{t.registration}</h3>
                    <span className="text-[9px] font-mono text-zinc-500 tracking-[0.2em] uppercase font-bold">Cipher Status: Ready</span>
                 </div>
                 <Lock className="w-5 h-5 text-zinc-700" />
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed mb-6 font-medium">{t.reg_desc}</p>
              <div 
                onClick={handleCopy}
                className="relative bg-black/60 rounded-2xl border-2 border-zinc-800 border-dashed hover:border-blue-500/50 cursor-pointer p-4 transition-all"
              >
                  <div className="flex items-center justify-between">
                      <div>
                         <span className="text-[8px] text-zinc-600 font-black uppercase tracking-[0.3em] mb-1 block">Security Access Key</span>
                         <span className="text-2xl font-mono font-black text-white tracking-[0.2em]">SNFOR77</span>
                      </div>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${copied ? 'bg-blue-500 text-black' : 'bg-zinc-900 text-zinc-500'}`}>
                          {copied ? <Check className="w-5 h-5" /> : <Copy className="w-4 h-4" />}
                      </div>
                  </div>
              </div>
           </div>
        </div>

        <div className="group relative">
           <div className="bg-zinc-950/80 border-2 border-zinc-900 rounded-[2rem] p-6 relative backdrop-blur-xl transition-all duration-300 hover:border-zinc-800">
              <div className="flex items-start justify-between mb-4">
                 <div>
                    <h3 className="text-lg font-black font-display text-white tracking-tight uppercase leading-none mb-1">{t.activation_deposit}</h3>
                    <span className="text-[9px] font-mono text-zinc-500 tracking-[0.2em] uppercase font-bold">Protocol: Capital Uplink</span>
                 </div>
                 <CreditCard className="w-5 h-5 text-zinc-700" />
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed mb-6 font-medium">{t.min_deposit}</p>
              <div className="grid grid-cols-2 gap-4" dir="ltr">
                <div className="bg-zinc-900/50 border border-zinc-800/80 p-4 rounded-2xl flex flex-col items-center justify-center">
                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-1">USD NODE</span>
                    <span className="text-2xl font-black text-white font-display">$5.00</span>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800/80 p-4 rounded-2xl flex flex-col items-center justify-center">
                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-1">EGP NODE</span>
                    <span className="text-2xl font-black text-white font-display">250</span>
                </div>
              </div>
           </div>
        </div>

        <div className="group relative">
            <div className={`p-8 rounded-[2.5rem] border-2 backdrop-blur-md transition-all duration-500 relative overflow-hidden ${errors.userId || errors.userIdLength ? 'bg-red-500/5 border-red-500/30' : 'bg-zinc-900/40 border-zinc-800 group-hover:border-zinc-700'}`}>
              <div className="flex justify-between items-start mb-8">
                 <div>
                    <h3 className="font-black font-display text-2xl text-white tracking-tighter uppercase">{t.verify_account}</h3>
                    <div className="flex items-center gap-2 mt-1">
                       <Activity className="w-3 h-3 text-zinc-500 animate-pulse" />
                       <p className="text-[9px] font-mono text-zinc-500 tracking-[0.2em] uppercase">Auth Sync Required</p>
                    </div>
                 </div>
                 <ShieldCheck className={`w-6 h-6 transition-colors ${userId ? 'text-blue-500' : 'text-zinc-700'}`} />
              </div>
              <div className="space-y-8">
                <div className="relative">
                  <label className="block text-[10px] text-zinc-500 mb-3 uppercase font-black tracking-[0.2em] ml-1">{t.userid_label}</label>
                  <div className="relative">
                      <div className="absolute inset-y-0 left-0 w-14 flex items-center justify-center border-r border-zinc-800">
                         <Fingerprint className={`w-6 h-6 ${userId ? 'text-blue-500' : 'text-zinc-700'}`} />
                      </div>
                      <input 
                        type="tel" 
                        value={userId}
                        onChange={handleUserIdChange}
                        placeholder={`ID_0000000000`}
                        disabled={isSubmitting}
                        maxLength={15}
                        className={`w-full bg-black/60 border-2 text-white font-mono text-lg pl-20 pr-6 py-5 rounded-2xl focus:outline-none transition-all ${errors.userId || errors.userIdLength ? 'border-red-500/40 focus:border-red-500' : 'border-zinc-800/80 focus:border-blue-500'}`}
                      />
                  </div>
                </div>
              </div>
              
              <button 
                onClick={validateAndSubmit}
                disabled={isSubmitting}
                className="w-full mt-12 h-20 rounded-[2rem] bg-white text-black font-black font-display text-sm tracking-[0.3em] transition-all flex items-center justify-center gap-4 shadow-2xl disabled:opacity-50 active:scale-[0.98] uppercase"
              >
                  <span>{t.submit_verification}</span>
                  <ArrowRight className="w-6 h-6" />
              </button>
           </div>
        </div>
      </div>

      {isSubmitting && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/98 backdrop-blur-3xl animate-in fade-in duration-500 p-6">
           <div className="relative w-full max-w-sm">
              <div className="absolute -inset-10 bg-blue-500/5 blur-[100px] rounded-full animate-pulse"></div>
              
              <div className="bg-zinc-950/90 border border-blue-500/20 rounded-[4rem] p-12 relative z-10 shadow-[0_0_120px_rgba(0,0,0,1)] overflow-hidden flex flex-col items-center">
                 <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Terminal className="w-8 h-8 text-blue-500" />
                 </div>

                 <div className="text-center mb-12 w-full">
                    <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.5em] mb-4">AUTHENTICATION TERMINAL</h3>
                    <h2 className="text-4xl font-display font-black text-white tracking-tighter uppercase mb-6 leading-[0.85]">
                       VERIFYING<br/><span className="text-blue-500">SESSION</span>
                    </h2>
                    
                    <div className="w-full mt-8">
                       <div className="flex justify-between items-end px-1 mb-3">
                          <span className="text-[10px] font-mono text-white tracking-widest font-black animate-pulse uppercase">{statusText}</span>
                          <span className="text-[14px] font-black text-blue-500 font-display">{Math.round(overallProgress)}%</span>
                       </div>
                       <div className="h-4 w-full bg-zinc-900 rounded-full border border-white/5 overflow-hidden p-1 shadow-inner relative">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-300 ease-out shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                            style={{ width: `${overallProgress}%` }}
                          />
                       </div>
                    </div>
                 </div>

                 <div className="space-y-6 w-full">
                    {verificationSteps.map((step, idx) => (
                        <div 
                          key={idx} 
                          className={`flex items-center gap-5 transition-all duration-500 ${step.status === 'active' ? 'opacity-100 scale-100' : step.status === 'completed' ? 'opacity-30' : 'opacity-10'}`}
                        >
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 ${
                              step.status === 'pending' ? 'bg-zinc-900 border-zinc-800 text-zinc-700' : 
                              step.status === 'active' ? 'bg-blue-500 border-blue-500 text-black shadow-[0_0_20px_rgba(59,130,246,0.4)]' : 
                              'bg-blue-500/10 border-blue-500/20 text-blue-500'
                            }`}>
                                <step.icon className="w-6 h-6" />
                            </div>
                            <span className={`text-[12px] font-black uppercase tracking-[0.25em] font-mono ${step.status === 'active' ? 'text-white' : 'text-zinc-600'}`}>
                               {step.label}
                            </span>
                            {step.status === 'completed' && <Check className="w-5 h-5 text-blue-500 ml-auto" />}
                        </div>
                    ))}
                 </div>

                 <div className="mt-14 w-full flex flex-col items-center gap-2 opacity-20">
                    <div className="h-px w-12 bg-zinc-500"></div>
                    <span className="text-[8px] font-mono text-zinc-500 tracking-[0.3em] uppercase font-bold">Encrypted Protocol Alpha-7</span>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default SettingsView;
