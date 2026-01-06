'use client';

import { useCallback } from 'react';
import Image from 'next/image';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import { useVariables } from '@gitroom/react/helpers/variable.context';
import { useT } from '@gitroom/react/translation/get.transation.service.client';
export const OauthProvider = () => {
  const fetch = useFetch();
  const { oauthLogoUrl, oauthDisplayName } = useVariables();
  const t = useT();
  const gotoLogin = useCallback(async () => {
    try {
      const response = await fetch('/auth/oauth/GENERIC');
      if (!response.ok) {
        throw new Error(
          `Login link request failed with status ${response.status}`
        );
      }
      const link = await response.text();

      if (typeof window !== 'undefined' && window.self !== window.top) {
        const popup = window.open(link, 'generic-oauth-login', 'width=500,height=600');

        const handleMessage = (event: MessageEvent) => {
          if (event.data?.type === 'login-success') {
            window.removeEventListener('message', handleMessage);
            window.location.reload();
          }
        };
        window.addEventListener('message', handleMessage);

        const timer = setInterval(() => {
          if (popup?.closed) {
            clearInterval(timer);
            // Reload main window to pick up the new session
            window.removeEventListener('message', handleMessage);
            window.location.reload();
          }
        }, 1000);
        return;
      }
      window.location.href = link;
    } catch (error) {
      console.error('Failed to get generic oauth login link:', error);
    }
  }, []);
  return (
    <div
      onClick={gotoLogin}
      className={`cursor-pointer flex-1 bg-white h-[44px] rounded-[4px] flex justify-center items-center text-customColor16 gap-[4px]`}
    >
      <div>
        <Image
          src={oauthLogoUrl || '/icons/generic-oauth.svg'}
          alt="genericOauth"
          width={40}
          height={40}
          className="-mt-[7px]"
        />
      </div>
      <div>
        {t('sign_in_with', 'Sign in with')}&nbsp;
        {oauthDisplayName || 'OAuth'}
      </div>
    </div>
  );
};
