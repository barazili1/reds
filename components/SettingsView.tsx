import React, { useState, useEffect } from 'react';
import { Copy, Check, ArrowRight, Download, Smartphone, CreditCard, ShieldCheck, Fingerprint, Database, Terminal, Server, Activity, Lock, ArrowLeft, Cpu, Globe, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Language, Platform } from '../types';
import { audioManager } from '../utils/audioManager';

interface SettingsViewProps {
  onComplete: (userId: string) => void;
  onBack: () => void;
  lang: Language;
  t: any;
  platform: Platform;
}

const SettingsView: React.FC<SettingsViewProps> = ({ onComplete, onBack, lang, t, platform }) => {
  const [copied, setCopied] = useState(false);
  const [userId, setUserId] = useState('');
  const [errors, setErrors] = useState<{ userId?: boolean; userIdLength?: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);
  const [statusText, setStatusText] = useState("جارٍ التهيئة...");
  
  const platformName = platform === 'linebet_v1' ? 'WINWIN' : 'GOOBET';
  const platformImg = platform === 'linebet_v1' 
    ? 'https://www.image2url.com/r2/default/images/1776200504700-76a44e57-f905-48c8-b91c-bd0939ae4633.jpeg'
    : 'https://www.image2url.com/r2/default/images/1776200548040-627ffa09-024d-4f16-9b09-e24dc2f6b697.png';

  const linebetDownloadUrl = "https://www.winwin.com/";
  const xbetDownloadUrl = "https://goobet.com";

  const [verificationSteps, setVerificationSteps] = useState([
    { id: 'server', label: t.step_server, status: "pending", icon: Server },
    { id: 'deposit', label: t.step_receipt, status: "pending", icon: Database },
    { id: 'id', label: t.step_validating, status: "pending", icon: Fingerprint }
  ]);

  const handleCopy = () => {
    audioManager.playCopy();
    navigator.clipboard.writeText("LM2020");
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
      onComplete(trimmedId);
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-[#020202] font-mono text-white selection:bg-green-500/30" dir="rtl">
      {/* Background Grid */}
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--primary-color-rgb),0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--primary-color-rgb),0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-green-500/10 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col px-6 pt-8 pb-24 max-w-4xl mx-auto w-full">
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-10">
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-xl bg-zinc-900/50 border border-white/10 flex items-center justify-center hover:border-green-500/50 hover:text-green-500 transition-all active:scale-90"
          >
            <ArrowLeft className="w-5 h-5 rotate-180" />
          </button>
          
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[9px] font-black tracking-widest uppercase text-green-500">النظام جاهز</span>
          </div>
        </div>

        {/* Steps Container - Horizontal Layout */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-nowrap overflow-x-auto pb-6 gap-4 snap-x no-scrollbar">
            {/* Step 1: Install */}
            <div className="group relative min-w-[280px] flex-1 snap-center">
              <div className="absolute -inset-px bg-gradient-to-r from-green-500/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative h-full bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 transition-all duration-300 group-hover:border-white/10 flex flex-col">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-black border border-white/10 overflow-hidden flex items-center justify-center">
                      <img src={platformImg} alt={platformName} className="w-8 h-8 object-contain" />
                    </div>
                    <div>
                      <span className="text-[8px] text-green-500 font-black uppercase tracking-widest block mb-1">الخطوة 01</span>
                      <h3 className="text-sm font-black uppercase tracking-tight">{t.install_app}</h3>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                    <Download className="w-4 h-4 text-zinc-500" />
                  </div>
                </div>
                <p className="text-[11px] text-zinc-400 mb-6 leading-relaxed flex-1">{t.install_desc}</p>
                <a 
                  href={platform === '1xbet' ? xbetDownloadUrl : linebetDownloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => audioManager.playClick()}
                  className="w-full h-12 rounded-2xl bg-white text-black font-black text-[10px] tracking-[0.2em] uppercase flex items-center justify-center gap-2 hover:bg-green-500 transition-all active:scale-[0.98]"
                >
                  <span>{t.install_btn}</span>
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </a>
              </div>
            </div>

            {/* Step 2: Registration */}
            <div className="group relative min-w-[280px] flex-1 snap-center">
              <div className="absolute -inset-px bg-gradient-to-r from-green-500/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative h-full bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 transition-all duration-300 group-hover:border-white/10 flex flex-col">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                      <Lock className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                      <span className="text-[8px] text-green-500 font-black uppercase tracking-widest block mb-1">الخطوة 02</span>
                      <h3 className="text-sm font-black uppercase tracking-tight">{t.registration}</h3>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-zinc-500" />
                  </div>
                </div>
                <p className="text-[11px] text-zinc-400 mb-6 leading-relaxed flex-1">{t.reg_desc}</p>
                <div 
                  onClick={handleCopy}
                  className="relative bg-black/40 rounded-2xl border border-white/10 border-dashed hover:border-green-500/50 cursor-pointer p-4 transition-all group/copy"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[7px] text-zinc-500 font-black uppercase tracking-widest mb-1 block">كود البروموكود</span>
                      <span className="text-xl font-black tracking-[0.2em] text-white">LM2020</span>
                    </div>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${copied ? 'bg-green-500 text-black' : 'bg-white/5 text-zinc-500 group-hover/copy:text-white'}`}>
                      {copied ? <Check className="w-5 h-5" /> : <Copy className="w-4 h-4" />}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Deposit */}
            <div className="group relative min-w-[280px] flex-1 snap-center">
              <div className="absolute -inset-px bg-gradient-to-r from-green-500/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative h-full bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 transition-all duration-300 group-hover:border-white/10 flex flex-col">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                      <span className="text-[8px] text-green-500 font-black uppercase tracking-widest block mb-1">الخطوة 03</span>
                      <h3 className="text-sm font-black uppercase tracking-tight">{t.activation_deposit}</h3>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                    <Globe className="w-4 h-4 text-zinc-500" />
                  </div>
                </div>
                <p className="text-[11px] text-zinc-400 mb-6 leading-relaxed flex-1">{t.min_deposit}</p>
                <div className="grid grid-cols-2 gap-3" dir="ltr">
                  <div className="bg-black/40 border border-white/5 p-4 rounded-2xl flex flex-col items-center justify-center">
                    <span className="text-[8px] text-zinc-500 font-black uppercase tracking-widest mb-1">دولار</span>
                    <span className="text-xl font-black text-white">$5.00</span>
                  </div>
                  <div className="bg-black/40 border border-white/5 p-4 rounded-2xl flex flex-col items-center justify-center">
                    <span className="text-[8px] text-zinc-500 font-black uppercase tracking-widest mb-1">جنيه</span>
                    <span className="text-xl font-black text-white">250</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Final Verification - Spans full width on larger screens */}
          <div className="group relative pt-6">
            <div className={`relative p-8 rounded-[2.5rem] border-2 transition-all duration-500 overflow-hidden ${errors.userId || errors.userIdLength ? 'bg-red-500/5 border-red-500/30' : 'bg-zinc-900/60 backdrop-blur-2xl border-white/10 group-hover:border-green-500/30'}`}>
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="font-black text-2xl tracking-tighter uppercase">{t.verify_account}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Activity className="w-3 h-3 text-green-500 animate-pulse" />
                    <p className="text-[8px] text-zinc-500 tracking-widest uppercase font-black">مزامنة المصادقة مطلوبة</p>
                  </div>
                </div>
                <ShieldCheck className={`w-8 h-8 transition-colors ${userId ? 'text-green-500' : 'text-zinc-800'}`} />
              </div>
              
              <div className="max-w-md">
                <div className="relative">
                  <label className="block text-[9px] text-zinc-500 mb-3 uppercase font-black tracking-widest ml-1">{t.userid_label}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 w-14 flex items-center justify-center border-l border-white/5">
                      <Fingerprint className={`w-6 h-6 ${userId ? 'text-green-500' : 'text-zinc-800'}`} />
                    </div>
                    <input 
                      type="tel" 
                      value={userId}
                      onChange={handleUserIdChange}
                      placeholder="0000000000"
                      disabled={isSubmitting}
                      maxLength={15}
                      className={`w-full bg-black/40 border border-white/10 text-white font-mono text-xl pr-20 pl-6 py-5 rounded-2xl focus:outline-none transition-all text-right ${errors.userId || errors.userIdLength ? 'border-red-500/40 focus:border-red-500' : 'focus:border-green-500/50'}`}
                    />
                  </div>
                </div>
              </div>
              
              <button 
                onClick={validateAndSubmit}
                disabled={isSubmitting}
                className="w-full sm:max-w-xs mt-10 h-16 rounded-2xl bg-green-500 text-black font-black text-xs tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(34,197,94,0.2)] hover:shadow-[0_0_40px_rgba(34,197,94,0.4)] active:scale-[0.98] uppercase"
              >
                <span>{t.submit_verification}</span>
                <ArrowRight className="w-5 h-5 rotate-180" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 flex flex-col items-center gap-4 opacity-30">
          <div className="h-px w-12 bg-zinc-800" />
          <span className="text-[7px] font-black uppercase tracking-[0.5em] text-center">بروتوكول تشفير آمن<br/>شبكة عقد ألفا-7</span>
        </div>
      </div>

      <AnimatePresence>
      </AnimatePresence>
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default SettingsView;
