import { Metadata } from 'next';
import { getKebabPlaces } from '@/lib/getKebabPlaces';
import { CityPageLayout } from '@/app/components/ui';
import { generateCityMetadata } from '@/app/utils/metadata';
import { getCityByPath } from '@/app/data/cities';

export const metadata: Metadata = generateCityMetadata(getCityByPath('/kebab-goteborg')!);

export default async function GoteborgKebabPage() {
  const places = await getKebabPlaces();
  console.log('places', places)
  const goteborgPlaces = places.filter((place: any) => 
    place.city?.toLowerCase().includes('göteborg') || 
    place.city?.toLowerCase().includes('goteborg') ||
    place.address?.toLowerCase().includes('göteborg') ||
    place.address?.toLowerCase().includes('goteborg')
  );
  console.log('places', places)

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
