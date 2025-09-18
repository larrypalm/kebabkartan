import { Metadata } from 'next';
import { getKebabPlaces } from '@/lib/getKebabPlaces';
import { CityPageLayout } from '@/app/components/ui';
import { generateCityMetadata } from '@/app/utils/metadata';
import { getCityByPath } from '@/app/data/cities';

export const metadata: Metadata = generateCityMetadata(getCityByPath('/kebab-linkoping')!);

export default async function LinkopingKebabPage() {
  const places = await getKebabPlaces();
  const linkopingPlaces = places.filter((place: any) => 
    place.city?.toLowerCase().includes('linköping') || 
    place.city?.toLowerCase().includes('linkoping') ||
    place.address?.toLowerCase().includes('linköping') ||
    place.address?.toLowerCase().includes('linkoping')
  );

  const city = getCityByPath('/kebab-linkoping')!;

  return (
    <CityPageLayout
      cityName={city.name}
      description={city.description}
      initialCenter={city.coordinates}
      initialZoom={city.zoom}
    />
  );
}
