import { Metadata } from 'next';
import TopListClient from '@/app/components/TopListClient';

export const metadata: Metadata = {
  title: 'Bästa Kebab i Linköping | Topplistor | Kebabkartan',
  description: 'Upptäck Linköpings bästa kebab, pizza och falafel baserat på användarrecensioner. Här är de högst rankade restaurangerna i Linköping.',
  openGraph: {
    title: 'Bästa Kebab i Linköping | Topplistor | Kebabkartan',
    description: 'Upptäck Linköpings bästa kebab, pizza och falafel baserat på användarrecensioner.',
  },
};

export default function LinkopingTopplista() {
  return (
    <TopListClient
      title="Bästa Kebab i Linköping"
      description="Upptäck de högst rankade restaurangerna i Linköping baserat på totalbetyg från användare. Här hittar du Linköpings bästa kebab, pizza och falafel."
      sortBy="rating"
      cityFilter="Linköping"
      breadcrumbs={[
        { label: 'Kebabkartan.se', href: '/' },
        { label: 'Topplistor', href: '/topplistor' },
        { label: 'Linköping' },
      ]}
      initialCenter={[58.4108, 15.6214]}
      initialZoom={12}
    />
  );
}
