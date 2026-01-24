export const dynamic = 'force-dynamic';
import { Forgot } from '@gitroom/frontend/components/auth/forgot';
import { Metadata } from 'next';
import { isGeneralServerSide } from '@gitroom/helpers/utils/is.general.server.side';
import { getBrandConfig } from '../../../../utils/brand-config';

export const metadata: Metadata = {
  title: `${getBrandConfig().appName} Forgot Password`,
  description: '',
};
export default async function Auth() {
  return <Forgot />;
}
