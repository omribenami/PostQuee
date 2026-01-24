export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import { AfterActivate } from '@gitroom/frontend/components/auth/after.activate';
import { isGeneralServerSide } from '@gitroom/helpers/utils/is.general.server.side';
import { getBrandConfig } from '../../../../../utils/brand-config';

export const metadata: Metadata = {
  title: `${getBrandConfig().appName} - Activate your account`,
  description: '',
};
export default async function Auth() {
  return <AfterActivate />;
}
