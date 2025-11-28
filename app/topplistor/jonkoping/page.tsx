import { Metadata } from 'next';
import TopListClient from '@/app/components/TopListClient';

export const metadata: Metadata = {
  title: 'Bästa Kebab i Jönköping | Topplistor | Kebabkartan',
  description: 'Upptäck Jönköpings bästa kebab, pizza och falafel baserat på användarrecensioner. Här är de högst rankade restaurangerna i Jönköping.',
  openGraph: {
    title: 'Bästa Kebab i Jönköping | Topplistor | Kebabkartan',
    description: 'Upptäck Jönköpings bästa kebab, pizza och falafel baserat på användarrecensioner.',
  },
};

export default function JonkopingTopplista() {
  return (
    <TopListClient
      title="Bästa Kebab i Jönköping"
      description="Upptäck de högst rankade restaurangerna i Jönköping baserat på totalbetyg från användare. Här hittar du Jönköpings bästa kebab, pizza och falafel."
      sortBy="rating"
      cityFilter="Jönköping"
      breadcrumbs={[
        { label: 'Kebabkartan.se', href: '/' },
        { label: 'Topplistor', href: '/topplistor' },
        { label: 'Jönköping' },
      ]}
      initialCenter={[57.7826, 14.1618]}
      initialZoom={12}
    />
  );
}
