import { Metadata } from 'next';
import { getKebabPlaces } from '@/lib/getKebabPlaces';
import { CityPageLayout } from '@/app/components/ui';
import { generateCityMetadata } from '@/app/utils/metadata';
import { getCityByPath } from '@/app/data/cities';

export const metadata: Metadata = generateCityMetadata(getCityByPath('/kebab-stockholm')!);

export default async function StockholmKebabPage() {
  const places = await getKebabPlaces();
  const stockholmPlaces = places.filter((place: any) => 
    place.city?.toLowerCase().includes('stockholm') || 
    place.address?.toLowerCase().includes('stockholm')
  );

  const city = getCityByPath('/kebab-stockholm')!;

  return (
    <CityPageLayout
      cityName={city.name}
      description={city.description}
      initialCenter={city.coordinates}
      initialZoom={city.zoom}
    />
  );
}
