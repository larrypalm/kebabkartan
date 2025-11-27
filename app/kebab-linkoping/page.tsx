import { Metadata } from 'next';
import CityPageClient from '@/app/components/CityPageClient';
import { generateCityMetadata } from '@/app/utils/metadata';
import { getCityByPath } from '@/app/data/cities';

export const metadata: Metadata = generateCityMetadata(getCityByPath('/kebab-linkoping')!);

export default function LinkopingKebabPage() {
  const city = getCityByPath('/kebab-linkoping')!;

  return (
    <CityPageClient
      cityName={city.name}
      description={city.description}
      initialCenter={city.coordinates}
      initialZoom={city.zoom}
    />
  );
}
