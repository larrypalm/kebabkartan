import { Metadata } from 'next';
import { CityPageLayout } from '@/app/components/ui';
import { generateCityMetadata } from '@/app/utils/metadata';
import { getCityByPath } from '@/app/data/cities';

export const metadata: Metadata = generateCityMetadata(getCityByPath('/kebab-goteborg')!);

export default async function GoteborgKebabPage() {
  const city = getCityByPath('/kebab-goteborg')!;

  return (
    <CityPageLayout
      cityName={city.name}
      description={city.description}
      initialCenter={city.coordinates}
      initialZoom={city.zoom}
    />
  );
}
