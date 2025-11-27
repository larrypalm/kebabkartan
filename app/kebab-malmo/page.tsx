import { Metadata } from 'next';
import CityPageClient from '@/app/components/CityPageClient';
import { generateCityMetadata } from '@/app/utils/metadata';
import { getCityByPath } from '@/app/data/cities';

export const metadata: Metadata = generateCityMetadata(getCityByPath('/kebab-malmo')!);

export default function MalmoKebabPage() {
  const city = getCityByPath('/kebab-malmo')!;

  return (
    <CityPageClient
      cityName={city.name}
      description={city.description}
      initialCenter={city.coordinates}
      initialZoom={city.zoom}
    />
  );
}
