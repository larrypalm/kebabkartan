import { Metadata } from 'next';
import { getKebabPlaces } from '@/lib/getKebabPlaces';
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('@/app/components/Map'), {
  ssr: false,
  loading: () => <p>Kartan laddar...</p>
});

export const metadata: Metadata = {
  title: 'Bästa Kebab i Linköping | Kebabkartan',
  description: 'Hitta de bästa kebabställena i Linköping. Läs recensioner, se betyg och upptäck nya favoriter. Kebabkartan hjälper dig hitta perfekt kebab i Linköping.',
  keywords: ['kebab Linköping', 'bästa kebab Linköping', 'kebab restaurang Linköping', 'kebab nära mig Linköping', 'kebab recensioner Linköping'],
  openGraph: {
    title: 'Bästa Kebab i Linköping | Kebabkartan',
    description: 'Hitta de bästa kebabställena i Linköping. Läs recensioner, se betyg och upptäck nya favoriter.',
    images: ['/static/logo.png'],
  },
};

export default async function LinkopingKebabPage() {
  const places = await getKebabPlaces();
  const linkopingPlaces = places.filter((place: any) => 
    place.city?.toLowerCase().includes('linköping') || 
    place.city?.toLowerCase().includes('linkoping') ||
    place.address?.toLowerCase().includes('linköping') ||
    place.address?.toLowerCase().includes('linkoping')
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
          Bästa Kebab i Linköping
        </h1>
        <p style={{ 
          fontSize: '14px', 
          color: '#6b7280', 
          margin: '0 0 12px 0',
          lineHeight: '1.4'
        }}>
          Upptäck Linköpings bästa kebabställen med hjälp av våra användares recensioner och betyg.
        </p>
        
        {/* Quick info */}
        <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#6b7280' }}>
          <span>✓ Verifierade recensioner</span>
          <span>✓ Uppdaterade betyg</span>
          <span>✓ Interaktiv karta</span>
        </div>
      </div>
      
      {/* Interactive Map - Full Screen */}
      <Map initialPlaceId={null} initialCenter={[58.4108, 15.6214]} initialZoom={12} />
    </div>
  );
}
