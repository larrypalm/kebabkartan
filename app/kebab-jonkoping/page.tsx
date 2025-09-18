import { Metadata } from 'next';
import { getKebabPlaces } from '@/lib/getKebabPlaces';
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('@/app/components/Map'), {
  ssr: false,
  loading: () => <p>Kartan laddar...</p>
});

export const metadata: Metadata = {
  title: 'Bästa Kebab i Jönköping | Kebabkartan',
  description: 'Hitta de bästa kebabställena i Jönköping. Läs recensioner, se betyg och upptäck nya favoriter. Kebabkartan hjälper dig hitta perfekt kebab i Jönköping.',
  keywords: ['kebab Jönköping', 'bästa kebab Jönköping', 'kebab restaurang Jönköping', 'kebab nära mig Jönköping', 'kebab recensioner Jönköping'],
  openGraph: {
    title: 'Bästa Kebab i Jönköping | Kebabkartan',
    description: 'Hitta de bästa kebabställena i Jönköping. Läs recensioner, se betyg och upptäck nya favoriter.',
    images: ['/static/logo.png'],
  },
};

export default async function JonkopingKebabPage() {
  const places = await getKebabPlaces();
  const jonkopingPlaces = places.filter((place: any) => 
    place.city?.toLowerCase().includes('jönköping') || 
    place.city?.toLowerCase().includes('jonkoping') ||
    place.address?.toLowerCase().includes('jönköping') ||
    place.address?.toLowerCase().includes('jonkoping')
  );

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      {/* SEO Content - Compact header */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        zIndex: 1000,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '12px',
        padding: '16px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        maxWidth: '600px'
      }}>
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          margin: '0 0 8px 0',
          color: '#1f2937'
        }}>
          Bästa Kebab i Jönköping
        </h1>
        <p style={{ 
          fontSize: '14px', 
          color: '#6b7280', 
          margin: '0 0 12px 0',
          lineHeight: '1.4'
        }}>
          Upptäck Jönköpings bästa kebabställen med hjälp av våra användares recensioner och betyg.
        </p>
        
        {/* Quick info */}
        <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#6b7280' }}>
          <span>✓ Verifierade recensioner</span>
          <span>✓ Uppdaterade betyg</span>
          <span>✓ Interaktiv karta</span>
        </div>
      </div>
      
      {/* Interactive Map - Full Screen */}
      <Map initialPlaceId={null} initialCenter={[57.7826, 14.1616]} initialZoom={12} />
    </div>
  );
}
