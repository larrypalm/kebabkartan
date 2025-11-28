import { Metadata } from 'next';
import TopListClient from '@/app/components/TopListClient';

export const metadata: Metadata = {
  title: 'Bästa Kebab i Göteborg | Topplistor | Kebabkartan',
  description: 'Upptäck Göteborgs bästa kebab, pizza och falafel baserat på användarrecensioner. Här är de högst rankade restaurangerna i Göteborg.',
  openGraph: {
    title: 'Bästa Kebab i Göteborg | Topplistor | Kebabkartan',
    description: 'Upptäck Göteborgs bästa kebab, pizza och falafel baserat på användarrecensioner.',
  },
};

export default function GoteborgTopplista() {
  return (
    <TopListClient
      title="Bästa Kebab i Göteborg"
      description="Upptäck de högst rankade restaurangerna i Göteborg baserat på totalbetyg från användare. Här hittar du västkustens bästa kebab, pizza och falafel."
      sortBy="rating"
      cityFilter="Göteborg"
      breadcrumbs={[
        { label: 'Kebabkartan.se', href: '/' },
        { label: 'Topplistor', href: '/topplistor' },
        { label: 'Göteborg' },
      ]}
      initialCenter={[57.7089, 11.9746]}
      initialZoom={12}
    />
  );
}
