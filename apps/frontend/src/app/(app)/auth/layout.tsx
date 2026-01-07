
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
      <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden text-white font-sans" style={{ background: 'linear-gradient(180deg, #1A2B3C 0%, #111 100%)' }}>
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
          <div className="hidden lg:flex flex-1 bg-[#2D3E50] border border-white/5 rounded-[24px] p-12 flex-col justify-between relative overflow-hidden backdrop-blur-sm shadow-2xl">
            <div className="z-20 relative">
              <div className="mb-12">
                <LogoTextComponent />
              </div>

              {/* Badge */}
              <div className="inline-block bg-[#FF8C00]/10 border border-[#FF8C00]/30 rounded-full px-5 py-2 mb-6">
                <span className="text-[#FF8C00] text-sm font-semibold">⚡ The Only Social Scheduler Built INTO WordPress</span>
              </div>

              <h1 className="text-5xl xl:text-6xl font-bold leading-tight tracking-tight">
                {t('schedule_social_without_leaving', 'Schedule Social Posts')} <br />
                <span className="text-[#FF8C00]">{t('without_leaving_wordpress', 'Without Leaving')} WordPress</span>
              </h1>
              <p className="mt-6 text-gray-300 text-lg max-w-lg leading-relaxed">
                {t('native_wordpress_description', 'Native WordPress plugin. Publish to LinkedIn, Facebook, Instagram, and X directly from your Gutenberg editor.')}
              </p>

              {/* Trust Badges */}
              <div className="mt-10 flex flex-wrap gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <span className="text-green-500 text-lg">✓</span>
                  <span>{t('secure_oauth', 'Secure OAuth')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500 text-lg">✓</span>
                  <span>{t('no_password_required', 'No Password Required')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500 text-lg">✓</span>
                  <span>{t('gdpr_compliant', 'GDPR Compliant')}</span>
                </div>
              </div>

              {/* Learn More Link */}
              <div className="mt-10">
                <a
                  href="https://postquee.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#FF8C00] hover:text-[#FF8C00]/80 transition-colors font-medium"
                >
                  <span>{t('learn_more', 'Learn more about PostQuee')}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </a>
              </div>
            </div>

            <div className="z-10 relative mt-auto pt-8">
              {/* Footer Trust Signals */}
              <div className="flex items-center gap-8 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  <span>{t('bank_level_security', 'Bank-Level Security')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path></svg>
                  <span>{t('open_source', 'Open Source (AGPL-3.0)')}</span>
                </div>
              </div>
            </div>

            {/* Decorative Grid */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
              style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '40px 40px' }}>
            </div>
          </div>

          {/* Right Side: Auth Form */}
          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="w-full max-w-[500px] bg-[#2D3E50] lg:bg-transparent border border-white/5 lg:border-none rounded-[24px] p-8 lg:p-0 shadow-xl lg:shadow-none">
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
