export const dynamic = 'force-dynamic';
import { Login } from '@gitroom/frontend/components/auth/login';
import { Metadata } from 'next';
import { isGeneralServerSide } from '@gitroom/helpers/utils/is.general.server.side';
import { getBrandConfig } from '../../../../utils/brand-config';
export const metadata: Metadata = {
  title: `${getBrandConfig().appName} Login`,
  description: '',
};
export default async function Auth() {
  return <Login />;
}
