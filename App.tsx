import React, { useState, useEffect } from 'react';
import { Globe, ArrowLeft } from 'lucide-react';
import SplashScreen from './components/SplashScreen';
import PlatformSelection from './components/PlatformSelection';
import { AppleGame } from './components/AppleGame';
import SettingsView from './components/SettingsView';
import { ViewState, Platform, AccessKey } from './types';
import { translations, Language } from './utils/translations';
import { audioManager } from './utils/audioManager';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('splash');
  const [activeTab, setActiveTab] = useState<'info' | 'conditions' | 'platform'>('platform');
  const [lang, setLang] = useState<Language>('en');
  const [userId, setUserId] = useState<string>('');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('linebet_v1');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [accessKeyData, setAccessKeyData] = useState<AccessKey | null>(null);

  const rawT = translations[lang];
  
  const processTranslations = (obj: any): any => {
    const platformName = selectedPlatform.startsWith('linebet') ? 'Linebet' : '1xBet';
    const newT: any = {};
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        newT[key] = obj[key].replace(/1xBet/gi, platformName);
      } else {
        newT[key] = obj[key];
      }
    }
    return newT;
  };

  const t = processTranslations(rawT);
  const isArabic = lang === 'ar';

  const PLATFORM_IMAGES: Record<Platform, string> = {
    linebet_v1: 'https://image2url.com/r2/default/images/1775220016764-cefe3d7b-9bc6-464b-a2ad-62153c543288.png',
    linebet_v2: 'https://image2url.com/r2/default/images/1775220016764-cefe3d7b-9bc6-464b-a2ad-62153c543288.png'
  };

  useEffect(() => {
    const initAudio = () => {
        audioManager.resume();
        document.removeEventListener('click', initAudio);
    };
    document.addEventListener('click', initAudio);
    return () => document.removeEventListener('click', initAudio);
  }, []);

  const handleSplashComplete = () => {
    setView('platform_selection');
    setActiveTab('platform');
  };

  const handlePlatformSelect = (p: Platform) => {
    setSelectedPlatform(p);
    setView('settings');
    setActiveTab('conditions');
  };

  const handleConditionsSubmit = (id: string) => {
    setUserId(id);
    setAccessKeyData({ key: id, expiresAt: Date.now() + 86400000 });
    setView('info');
    setActiveTab('info');
  };

  const handleBack = () => {
    audioManager.playClick();
    if (view === 'settings') {
      setView('platform_selection');
      setActiveTab('platform');
    } else if (view === 'info') {
      setView('platform_selection');
      setActiveTab('platform');
    }
  };
  
  const toggleLanguage = (l: Language) => {
      audioManager.playClick();
      setLang(l);
      setIsLangMenuOpen(false);
  }

  const renderContent = () => {
    if (view === 'platform_selection') {
      return <PlatformSelection onSelect={handlePlatformSelect} t={t} />;
    }

    switch (activeTab) {
      case 'info':
        return (
          <AppleGame 
            onBack={handleBack} 
            accessKeyData={accessKeyData} 
            language={lang} 
            onLanguageChange={toggleLanguage} 
            platform={selectedPlatform} 
          />
        );
      case 'conditions':
        return <SettingsView onComplete={handleConditionsSubmit} lang={lang} t={t} platform={selectedPlatform} />;
      default:
        return (
          <AppleGame 
            onBack={handleBack} 
            accessKeyData={accessKeyData} 
            language={lang} 
            onLanguageChange={toggleLanguage} 
            platform={selectedPlatform} 
          />
        );
    }
  };

  return (
    <div dir="ltr" className={isArabic ? 'font-arabic' : 'font-sans'}>
      {view === 'splash' && <SplashScreen onComplete={handleSplashComplete} language={lang} />}
      
      <div 
        className={`fixed inset-0 bg-black text-white flex flex-col transition-opacity duration-1000 ${view === 'splash' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        <header className="px-6 py-4 flex items-center justify-between border-b border-green-500/10 bg-black/80 backdrop-blur-md z-20 shrink-0">
          <div className="flex items-center gap-4">
            {view !== 'platform_selection' && (
              <button 
                onClick={handleBack}
                className="p-2 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:border-green-500/50 hover:text-green-500 transition-all group active:scale-90"
                aria-label="Go back"
              >
                <ArrowLeft className="w-4 h-4 text-zinc-400 group-hover:text-green-500 transition-colors" />
              </button>
            )}
            
            {view === 'info' ? (
              <div className="flex items-center gap-2.5">
                <div className="border border-green-500/30 rounded-[8px] px-2 py-1 bg-black/50 flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-md overflow-hidden border border-green-500/40">
                        <img 
                            src={PLATFORM_IMAGES[selectedPlatform]} 
                            alt={selectedPlatform} 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <h1 className="text-[10px] font-black text-white tracking-[0.1em] uppercase leading-none font-mono">
                        ID: <span className="text-green-500">{accessKeyData?.key || "8963007529"}</span> | <span className="text-white">{selectedPlatform.replace('_', ' ').toUpperCase()}</span>
                    </h1>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e] animate-pulse"></div>
                <span className="font-display font-bold text-xl tracking-tighter text-white">
                  SANFOR<span className="text-green-500">VIP</span>
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
             <div className="relative">
                <button 
                  onClick={() => { audioManager.playClick(); setIsLangMenuOpen(!isLangMenuOpen); }}
                  className={`flex items-center gap-2 h-8 pl-3 pr-2 rounded bg-zinc-900 border transition-all duration-200 group ${isLangMenuOpen ? 'border-green-500 text-white' : 'border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}
                >
                    <Globe className={`w-3.5 h-3.5 transition-colors ${isLangMenuOpen ? 'text-green-500' : 'text-zinc-500'}`} />
                    <span className="text-[10px] font-bold font-display uppercase tracking-widest">{lang === 'en' ? 'EN' : 'AR'}</span>
                </button>

                {isLangMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => { audioManager.playClick(); setIsLangMenuOpen(false); }} />
                    <div className="absolute top-full mt-2 w-32 bg-zinc-950 border border-green-500/30 rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.8)] overflow-hidden z-40 animate-in fade-in slide-in-from-top-2 duration-200 right-0">
                       <div className="p-1 space-y-0.5">
                          <button
                            onClick={() => toggleLanguage('en')}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded transition-all ${lang === 'en' ? 'bg-green-500/20 text-green-400' : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'}`}
                          >
                             <span className="text-[10px] font-bold font-display tracking-widest">ENGLISH</span>
                          </button>
                          
                          <button
                            onClick={() => toggleLanguage('ar')}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded transition-all ${lang === 'ar' ? 'bg-green-500/20 text-green-400' : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'}`}
                          >
                             <span className="text-[10px] font-bold font-display tracking-widest">ARABIC</span>
                          </button>
                       </div>
                    </div>
                  </>
                )}
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-hidden relative">
            <div 
              className="absolute inset-0 opacity-5 pointer-events-none" 
              style={{ 
                  backgroundImage: 'linear-gradient(#22c55e 1px, transparent 1px), linear-gradient(90deg, #22c55e 1px, transparent 1px)', 
                  backgroundSize: '40px 40px'
              }} 
            />
            <div className="h-full w-full max-w-lg mx-auto relative z-10">
                {renderContent()}
            </div>
        </main>
      </div>
    </div>
  );
};

export default App;