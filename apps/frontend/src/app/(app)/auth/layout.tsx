'use client';

import { ReactNode, useState, useEffect, useRef } from 'react';
import { Logo } from '@gitroom/frontend/components/new-layout/logo';
import { useTranslationSettings } from '@gitroom/react/translation/get.transation.service.client';
import clsx from 'clsx';
import Link from 'next/link';
import ReactCountryFlag from 'react-country-flag';
import useCookie from 'react-use-cookie';
import { cookieName, languages } from '@gitroom/react/translation/i18n.config';

const TEXTS: any = {
  en: {
    headline: "Schedule Social Posts\nWithout Leaving WordPress",
    sub: "Native WordPress plugin. Publish to LinkedIn, Facebook, Instagram,\nand X directly from your Gutenberg editor",
    features: "GDPR Compliant ✓   No Password Required ✓   Secure OAuth ✓",
    link: "Learn more about PostQuee",
    badge: "The Only Social Scheduler Built INTO WordPress"
  },
  he: {
    headline: "תזמון פוסטים לרשתות חברתיות\nישירות מתוך וורדפרס",
    sub: "תוסף וורדפרס מקורי. פרסם ל-LinkedIn, Facebook, Instagram\nו-X ישירות מעורך גוטנברג שלך",
    features: "תואם GDPR ✓   ללא צורך בסיסמה ✓   OAuth מאובטח ✓",
    link: "למד עוד על PostQuee",
    badge: "הכלי היחיד לתזמון מתוך וורדפרס"
  },
  ja: {
    headline: "WordPressを離れずに\nSNS投稿をスケジュール",
    sub: "WordPress完全統合プラグイン。Gutenbergエディタから\nLinkedIn、Facebook、Instagram、Xへ直接投稿",
    features: "GDPR準拠 ✓   パスワード不要 ✓   安全なOAuth接続 ✓",
    link: "PostQueeについて詳しい情報",
    badge: "WordPress統合型の唯一のSNSスケジューラー"
  },
  es: {
    headline: "Programa publicaciones sociales\nsin salir de WordPress",
    sub: "Plugin nativo de WordPress. Publica en LinkedIn, Facebook, Instagram\ny X directamente desde tu editor Gutenberg",
    features: "Cumple con GDPR ✓   Sin contraseñas ✓   OAuth seguro ✓",
    link: "Más información sobre PostQuee",
    badge: "El único programador social integrado en WordPress"
  },
  fr: {
    headline: "Planifiez vos posts sociaux\nsans quitter WordPress",
    sub: "Plugin WordPress natif. Publiez sur LinkedIn, Facebook, Instagram\net X directement depuis votre éditeur Gutenberg",
    features: "Conforme RGPD ✓   Pas de mot de passe ✓   OAuth sécurisé ✓",
    link: "En savoir plus sur PostQuee",
    badge: "Le seul planificateur social intégré à WordPress"
  },
  pt: {
    headline: "Agende posts sociais\nsem sair do WordPress",
    sub: "Plugin nativo do WordPress. Publique no LinkedIn, Facebook, Instagram\ne X diretamente do seu editor Gutenberg",
    features: "Compatível com GDPR ✓   Sem senha ✓   OAuth seguro ✓",
    link: "Saiba mais sobre o PostQuee",
    badge: "O único agendador social integrado ao WordPress"
  },
  ru: {
    headline: "Планируйте посты в соцсетях,\nне покидая WordPress",
    sub: "Нативный плагин WordPress. Публикуйте в LinkedIn, Facebook, Instagram\nи X прямо из редактора Gutenberg",
    features: "GDPR ✓   Без паролей ✓   Безопасный OAuth ✓",
    link: "Подробнее о PostQuee",
    badge: "Единственный планировщик, встроенный в WordPress"
  },
  zh: {
    headline: "无需离开 WordPress\n即可安排社交媒体发布",
    sub: "原生 WordPress 插件。直接从 Gutenberg 编辑器发布到\nLinkedIn、Facebook、Instagram 和 X",
    features: "符合 GDPR ✓   无需密码 ✓   安全 OAuth ✓",
    link: "了解更多关于 PostQuee",
    badge: "唯一内置于 WordPress 的社交调度程序"
  }
};

const getCountryCodeForFlag = (languageCode: string) => {
  if (languageCode === 'en') return 'GB';
  if (languageCode === 'he') return 'IL';
  if (languageCode === 'es') return 'ES';
  if (languageCode === 'pt') return 'PT';
  if (languageCode === 'fr') return 'FR';
  if (languageCode === 'ja') return 'JP';
  if (languageCode === 'zh') return 'CN';
  if (languageCode === 'ru') return 'RU';
  if (languageCode === 'ar') return 'SA';
  if (languageCode === 'de') return 'DE';
  if (languageCode === 'it') return 'IT';
  if (languageCode === 'ko') return 'KR';
  if (languageCode === 'tr') return 'TR';
  if (languageCode === 'vi') return 'VN';
  return languageCode.toUpperCase();
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  const settings = useTranslationSettings();
  const currentLang = settings?.language || 'en';
  // Use first part of language code (e.g. 'pt-BR' -> 'pt') for fallback
  const langKey = currentLang.split('-')[0];
  const content = TEXTS[currentLang] || TEXTS[langKey] || TEXTS['en'];
  const isRtl = langKey === 'he' || langKey === 'ar';
  
  const [cookie, setCookie] = useCookie(cookieName);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const changeLanguage = (lng: string) => {
    setCookie(lng);
    window.location.reload();
  };

  return (
    <div className="flex min-h-screen w-full bg-[#0B0E14] text-[#F9FAFB] font-sans overflow-hidden relative">
      
      {/* LEFT: Form Area */}
      <div className="w-full lg:w-[45%] flex flex-col items-center justify-center p-8 lg:p-12 relative z-10 bg-[#0B0E14]">
        
        {/* Language Switcher */}
        <div className={clsx("absolute top-6 z-50", isRtl ? "right-6" : "left-6")}>
            <div className="relative" ref={dropdownRef}>
                <button 
                   onClick={() => setIsOpen(!isOpen)}
                   className="flex items-center gap-2 px-3 py-2 bg-[#1A1D26] border border-white/10 rounded-lg hover:border-[#FF6900]/50 transition-all text-sm font-medium shadow-lg group"
                >
                    <ReactCountryFlag countryCode={getCountryCodeForFlag(currentLang)} svg className="rounded-sm" style={{ width: '1.2em', height: '1.2em' }} />
                    <span className="uppercase text-gray-300 group-hover:text-white px-1">{currentLang}</span>
                    <svg className={clsx("w-3 h-3 text-gray-500 group-hover:text-[#FF6900] transition-transform", isOpen && "rotate-180")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {isOpen && (
                    <div className={clsx("absolute top-full mt-2 w-48 bg-[#1A1D26] border border-white/10 rounded-lg shadow-xl overflow-hidden z-[60] animate-in fade-in zoom-in-95 max-h-[400px] overflow-y-auto scrollbar-hide", isRtl ? "right-0" : "left-0")}>
                        {languages.map((lng: string) => (
                            <button
                               key={lng}
                               onClick={() => changeLanguage(lng)}
                               className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-white/5 text-sm transition-colors text-gray-400 hover:text-white border-b border-white/5 last:border-0"
                            >
                               <ReactCountryFlag countryCode={getCountryCodeForFlag(lng)} svg className="rounded-sm shrink-0" style={{ width: '1.2em', height: '1.2em' }} />
                               <span className="capitalize flex-1 truncate">{lng === 'en' ? 'English' : lng === 'he' ? 'עברית' : lng === 'ja' ? '日本語' : lng}</span>
                               {currentLang === lng && <span className="text-[#FF6900] text-xs shrink-0">●</span>}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>

        <div className="w-full max-w-[420px] flex flex-col gap-8">
           <div className="w-full">
             {children}
           </div>
        </div>
      </div>

      {/* RIGHT: Marketing Area */}
      <div className={clsx(
        "hidden lg:flex w-[55%] flex-col relative overflow-hidden",
        "bg-[#12151C] border-l border-white/5",
        isRtl ? "text-right items-end" : "text-left items-start"
      )}>
        {/* Background Effects */}
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#FF6900] opacity-[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-900/10 rounded-full blur-[100px]" />

        {/* Content Container */}
        <div className="relative z-10 flex flex-col h-full p-20 justify-between w-full">
          <div className={clsx("flex w-full", isRtl ? "justify-start" : "justify-end")}>
             <div className="scale-150 opacity-90 hover:opacity-100 transition-opacity">
                <Logo />
             </div>
          </div>

          <div className={clsx("flex flex-col gap-8 max-w-[650px]", isRtl ? "items-end" : "items-start")}>
             <div className="inline-flex px-4 py-2 rounded-full border border-[#FF6900]/30 bg-[#FF6900]/5 text-[#FF6900] text-sm font-medium w-fit shadow-[0_0_15px_rgba(255,105,0,0.15)] backdrop-blur-sm">
                {content.badge}
             </div>

             <h1 className="text-5xl font-bold leading-snug tracking-tight text-white drop-shadow-lg whitespace-pre-line">
               {content.headline}
             </h1>

             <p className="text-lg text-gray-400 leading-relaxed max-w-[550px] whitespace-pre-line">
               {content.sub}
             </p>

             <div className="text-sm font-mono text-emerald-400/90 tracking-wide mt-2" dir="ltr">
               {isRtl ? content.features.split('✓').reverse().join('✓') : content.features} 
             </div>

             <Link href="https://postquee.com" className="text-[#FF6900] hover:text-[#FF8533] transition-colors flex items-center gap-2 mt-4 group font-medium text-lg">
               {content.link}
               <span className={clsx("transition-transform", isRtl ? "group-hover:-translate-x-1 rotate-180" : "group-hover:translate-x-1")}>→</span>
             </Link>
          </div>

          <div className={clsx("flex text-xs text-gray-600 font-mono uppercase tracking-widest opacity-60 w-full", isRtl ? "flex-row-reverse" : "flex-row", "justify-between")}>
             <span>Open Source (AGPL-3.0)</span>
             <span>Bank-Level Security</span>
          </div>
        </div>
      </div>
    </div>
  );
}
