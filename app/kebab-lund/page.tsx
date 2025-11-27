import { Metadata } from 'next';
import CityPageClient from '@/app/components/CityPageClient';
import { generateCityMetadata } from '@/app/utils/metadata';
import { getCityByPath } from '@/app/data/cities';

export const metadata: Metadata = generateCityMetadata(getCityByPath('/kebab-lund')!);

export default function LundKebabPage() {
  const city = getCityByPath('/kebab-lund')!;

  return (
    <CityPageClient
      cityName={city.name}
      description={city.description}
      initialCenter={city.coordinates}
      initialZoom={city.zoom}
    />
  );
}
