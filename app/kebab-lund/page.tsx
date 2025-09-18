import { Metadata } from 'next';
import { getKebabPlaces } from '@/lib/getKebabPlaces';
import { CityPageLayout } from '@/app/components/ui';
import { generateCityMetadata } from '@/app/utils/metadata';
import { getCityByPath } from '@/app/data/cities';

export const metadata: Metadata = generateCityMetadata(getCityByPath('/kebab-lund')!);

export default async function LundKebabPage() {
  const places = await getKebabPlaces();
  const lundPlaces = places.filter((place: any) => 
    place.city?.toLowerCase().includes('lund') || 
    place.address?.toLowerCase().includes('lund')
  );

  const city = getCityByPath('/kebab-lund')!;

  return (
    <CityPageLayout
      cityName={city.name}
      description={city.description}
      initialCenter={city.coordinates}
      initialZoom={city.zoom}
    />
  );
}
