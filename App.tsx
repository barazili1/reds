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
  const [lang, setLang] = useState<Language>('ar');
  const [userId, setUserId] = useState<string>('');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('linebet_v1');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [accessKeyData, setAccessKeyData] = useState<AccessKey | null>(null);

  const rawT = translations[lang];
  
  const processTranslations = (obj: any): any => {
    const platformName = selectedPlatform === 'linebet_v1' ? 'WINWIN' : 'GOOBET';
    const newT: any = {};
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        newT[key] = obj[key].replace(/1xBet|Linebet/gi, platformName);
      } else {
        newT[key] = obj[key];
      }
    }
    return newT;
  };

  const t = processTranslations(rawT);
  const isArabic = lang === 'ar';

  useEffect(() => {
    const root = document.documentElement;
    if (selectedPlatform === 'linebet_v2') {
      root.style.setProperty('--primary-color', '#3b82f6');
      root.style.setProperty('--primary-color-rgb', '59, 130, 246');
      root.style.setProperty('--primary-glow', 'rgba(59, 130, 246, 0.5)');
    } else {
      root.style.setProperty('--primary-color', '#22c55e');
      root.style.setProperty('--primary-color-rgb', '34, 197, 94');
      root.style.setProperty('--primary-glow', 'rgba(34, 197, 94, 0.5)');
    }
  }, [selectedPlatform]);

  const PLATFORM_IMAGES: Record<Platform, string> = {
    linebet_v1: 'https://www.image2url.com/r2/default/images/1776200504700-76a44e57-f905-48c8-b91c-bd0939ae4633.jpeg',
    linebet_v2: 'https://www.image2url.com/r2/default/images/1776200548040-627ffa09-024d-4f16-9b09-e24dc2f6b697.png'
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
        return (
          <SettingsView 
            onComplete={handleConditionsSubmit} 
            onBack={handleBack}
            lang={lang} 
            t={t} 
            platform={selectedPlatform} 
          />
        );
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
    <div dir={isArabic ? 'rtl' : 'ltr'} className={isArabic ? 'font-arabic' : 'font-sans'}>
      {view === 'splash' && <SplashScreen onComplete={handleSplashComplete} language={lang} />}
      
      <div 
        className={`fixed inset-0 bg-black text-white flex flex-col transition-opacity duration-1000 ${view === 'splash' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        <main className="flex-1 overflow-y-auto custom-scrollbar relative">
            <div 
              className="absolute inset-0 opacity-5 pointer-events-none" 
              style={{ 
                  backgroundImage: 'linear-gradient(var(--primary-color) 1px, transparent 1px), linear-gradient(90deg, var(--primary-color) 1px, transparent 1px)', 
                  backgroundSize: '40px 40px'
              }} 
            />
            <div className="min-h-full w-full max-w-lg mx-auto relative z-10">
                {renderContent()}
            </div>
        </main>
      </div>
    </div>
  );
};

export default App;