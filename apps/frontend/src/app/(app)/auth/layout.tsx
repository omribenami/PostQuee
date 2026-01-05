
import { getT } from '@gitroom/react/translation/get.translation.service.backend';
export const dynamic = 'force-dynamic';
import { ReactNode } from 'react';
import loadDynamic from 'next/dynamic';
import { TestimonialComponent } from '@gitroom/frontend/components/auth/testimonial.component';
import { LogoTextComponent } from '@gitroom/frontend/components/ui/logo-text.component';
import { MantineWrapper } from '@gitroom/react/helpers/mantine.wrapper';
import { LanguageComponent } from '@gitroom/frontend/components/layout/language.component';

const ReturnUrlComponent = loadDynamic(() => import('./return.url.component'));

export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const t = await getT();

  return (
    <MantineWrapper>
      <div className="bg-[#0E0E0E] min-h-screen w-full flex items-center justify-center relative overflow-hidden text-white font-sans">
        <ReturnUrlComponent />

        {/* Language Selector */}
        <div className="absolute top-5 right-5 z-50">
          <LanguageComponent />
        </div>

        {/* Background Ambience */}
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#FF8C00] opacity-[0.12] blur-[180px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#FF8C00] opacity-[0.12] blur-[180px] rounded-full pointer-events-none" />

        <div className="w-full max-w-[1600px] h-full lg:h-[90vh] flex flex-col lg:flex-row gap-4 p-4 lg:p-8 z-10">

          {/* Left Side: Visuals (Hidden on small screens) */}
          <div className="hidden lg:flex flex-1 bg-[#1A1919] border border-white/5 rounded-[24px] p-12 flex-col justify-between relative overflow-hidden backdrop-blur-sm shadow-2xl">
            <div className="z-20 relative">
              <div className="mb-12">
                <LogoTextComponent />
              </div>
              <h1 className="text-5xl xl:text-6xl font-bold leading-tight tracking-tight">
                {t('publish_on_wordpress', 'Publish on WordPress.')} <br />
                <span className="text-[#FF8C00]">{t('trend_on_social', 'Trend on Social.')}</span>
              </h1>
              <p className="mt-8 text-gray-300 text-lg max-w-lg leading-relaxed">
                {t('ultimate_scheduler_description', 'The ultimate auto-scheduler for Creators and Agencies. Automatically format, optimize, and schedule your posts for LinkedIn, Facebook, Instagram, and X.')}
              </p>

              <div className="mt-12 grid grid-cols-1 gap-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-[#FF8C00]/10 text-[#FF8C00]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{t('seamless_integration', 'Seamless Integration')}</h3>
                    <p className="text-gray-400 text-sm mt-1">{t('native_wordpress_plugin', 'Native WordPress plugin that feels like part of your dashboard.')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-[#FF8C00]/10 text-[#FF8C00]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{t('smart_ai_formatting', 'Smart AI Formatting')}</h3>
                    <p className="text-gray-400 text-sm mt-1">{t('auto_generate_captions', 'Auto-generate captions and hashtags tailored for each platform.')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-[#FF8C00]/10 text-[#FF8C00]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{t('unified_analytics', 'Unified Analytics')}</h3>
                    <p className="text-gray-400 text-sm mt-1">{t('track_engagement', 'Track engagement, likes, and shares across all connected networks.')}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="z-10 relative mt-auto w-full pt-8">
              {/* Optional: We can keep the testimonial component or remove it if not needed. */}
              {/* <TestimonialComponent />  */}
            </div>

            {/* Decorative Grid */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
              style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '40px 40px' }}>
            </div>
          </div>

          {/* Right Side: Auth Form */}
          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="w-full max-w-[500px] bg-[#1A1919] lg:bg-transparent border border-white/5 lg:border-none rounded-[24px] p-8 lg:p-0 shadow-xl lg:shadow-none">
              <div className="lg:hidden mb-8 flex justify-center">
                <LogoTextComponent />
              </div>

              {children}
            </div>
          </div>

        </div>
      </div>
    </MantineWrapper>
  );
}
