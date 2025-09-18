import { Metadata } from 'next';
import { getKebabPlaces } from '@/lib/getKebabPlaces';
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('@/app/components/Map'), {
  ssr: false,
  loading: () => <p>Kartan laddar...</p>
});

export const metadata: Metadata = {
  title: 'Bästa Kebab i Göteborg | Kebabkartan',
  description: 'Hitta de bästa kebabställena i Göteborg. Läs recensioner, se betyg och upptäck nya favoriter. Kebabkartan hjälper dig hitta perfekt kebab i Göteborg.',
  keywords: ['kebab Göteborg', 'bästa kebab Göteborg', 'kebab restaurang Göteborg', 'kebab nära mig Göteborg', 'kebab recensioner Göteborg'],
  openGraph: {
    title: 'Bästa Kebab i Göteborg | Kebabkartan',
    description: 'Hitta de bästa kebabställena i Göteborg. Läs recensioner, se betyg och upptäck nya favoriter.',
    images: ['/static/logo.png'],
  },
};

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

  return (
    <>
      {/* SEO Content - Hidden but accessible to search engines */}
      <div className="sr-only">
        <h1>Bästa Kebab i Göteborg | Kebabkartan</h1>
        <p>Upptäck Göteborgs bästa kebabställen med hjälp av våra användares recensioner och betyg. Hitta din nya favorit kebab i Göteborg!</p>
        
        <h2>Varför välja Kebabkartan för kebab i Göteborg?</h2>
        <ul>
          <li>Verifierade recensioner från riktiga kebabälskare</li>
          <li>Uppdaterade betyg för alla kebabställen i Göteborg</li>
          <li>Enkel navigation med interaktiv karta</li>
          <li>Lokala insikter om Göteborgs bästa kebab</li>
        </ul>

        <h2>Populära kebabställen i Göteborg</h2>
        <p>Här är några av de mest omtyckta kebabställena i Göteborg enligt våra användare:</p>
        
        {goteborgPlaces.length > 0 && (
          <div>
            {goteborgPlaces.slice(0, 5).map((place: any) => (
              <div key={place.id}>
                <h3>{place.name}</h3>
                <p>{place.address}</p>
                {place.rating && <p>Betyg: {place.rating}/5</p>}
              </div>
            ))}
          </div>
        )}

        <h2>Så här hittar du bästa kebaben i Göteborg</h2>
        <div>
          <h3>1. Använd vår karta</h3>
          <p>Zooma in på Göteborg i vår interaktiva karta för att se alla kebabställen i området.</p>
          
          <h3>2. Läs recensioner</h3>
          <p>Kolla vad andra kebabälskare säger om olika ställen innan du beställer.</p>
          
          <h3>3. Jämför betyg</h3>
          <p>Se genomsnittsbetyg för att snabbt hitta de bästa kebabställena.</p>
          
          <h3>4. Dela dina erfarenheter</h3>
          <p>Betygsätt och recensera kebabställen för att hjälpa andra kebabälskare.</p>
        </div>
      </div>
      
      {/* Interactive Map - Full Screen */}
      <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
        <Map initialPlaceId={null} initialCenter={[57.7089, 11.9746]} initialZoom={12} />
      </div>
    </>
  );
}
