import { Metadata } from 'next';
import { getKebabPlaces } from '@/lib/getKebabPlaces';
import { CityPageLayout } from '@/app/components/ui';
import { generateCityMetadata } from '@/app/utils/metadata';
import { getCityByPath } from '@/app/data/cities';

export const metadata: Metadata = generateCityMetadata(getCityByPath('/kebab-malmo')!);

export default async function MalmoKebabPage() {
  const places = await getKebabPlaces();
  const malmoPlaces = places.filter((place: any) => 
    place.city?.toLowerCase().includes('malmö') || 
    place.city?.toLowerCase().includes('malmo') ||
    place.address?.toLowerCase().includes('malmö') ||
    place.address?.toLowerCase().includes('malmo')
  );

  const city = getCityByPath('/kebab-malmo')!;

  return (
    <CityPageLayout
      cityName={city.name}
      description={city.description}
      initialCenter={city.coordinates}
      initialZoom={city.zoom}
    />
  );
}
