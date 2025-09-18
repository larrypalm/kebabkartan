import { Metadata } from 'next';
import { getKebabPlaces } from '@/lib/getKebabPlaces';
import { CityPageLayout } from '@/app/components/ui';
import { generateCityMetadata } from '@/app/utils/metadata';
import { getCityByPath } from '@/app/data/cities';

export const metadata: Metadata = generateCityMetadata(getCityByPath('/kebab-jonkoping')!);

export default async function JonkopingKebabPage() {
  const places = await getKebabPlaces();
  const jonkopingPlaces = places.filter((place: any) => 
    place.city?.toLowerCase().includes('jönköping') || 
    place.city?.toLowerCase().includes('jonkoping') ||
    place.address?.toLowerCase().includes('jönköping') ||
    place.address?.toLowerCase().includes('jonkoping')
  );

  const city = getCityByPath('/kebab-jonkoping')!;

  return (
    <CityPageLayout
      cityName={city.name}
      description={city.description}
      initialCenter={city.coordinates}
      initialZoom={city.zoom}
    />
  );
}
