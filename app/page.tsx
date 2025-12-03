import HomeClient from './HomeClient';
import { getKebabPlaces } from '@/lib/getKebabPlaces';

export default async function HomePage() {
  // Fetch restaurant data server-side for SEO
  let initialLocations: any[] = [];

  try {
    initialLocations = await getKebabPlaces();
  } catch (error) {
    console.error('Error fetching restaurants server-side:', error);
  }

  return <HomeClient initialLocations={initialLocations} />;
}
