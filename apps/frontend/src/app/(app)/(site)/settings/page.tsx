import { SettingsPopup } from '@gitroom/frontend/components/layout/settings.component';
export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import { isGeneralServerSide } from '@gitroom/helpers/utils/is.general.server.side';
import { getBrandConfig } from '../../../../utils/brand-config';

export const metadata: Metadata = {
  title: `${getBrandConfig().appName} Settings`,
  description: '',
};
export default async function Index({
  searchParams,
}: {
  searchParams: {
    code: string;
  };
}) {
  return <SettingsPopup />;
}
