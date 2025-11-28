import { Metadata } from 'next';
import TopListClient from '@/app/components/TopListClient';

export const metadata: Metadata = {
  title: 'Bästa Kebab i Stockholm | Topplistor | Kebabkartan',
  description: 'Upptäck Stockholms bästa kebab, pizza och falafel baserat på användarrecensioner. Här är de högst rankade restaurangerna i Stockholm.',
  openGraph: {
    title: 'Bästa Kebab i Stockholm | Topplistor | Kebabkartan',
    description: 'Upptäck Stockholms bästa kebab, pizza och falafel baserat på användarrecensioner.',
  },
};

export default function StockholmTopplista() {
  return (
    <TopListClient
      title="Bästa Kebab i Stockholm"
      description="Upptäck de högst rankade restaurangerna i Stockholm baserat på totalbetyg från användare. Här hittar du huvudstadens bästa kebab, pizza och falafel."
      sortBy="rating"
      cityFilter="Stockholm"
      breadcrumbs={[
        { label: 'Kebabkartan.se', href: '/' },
        { label: 'Topplistor', href: '/topplistor' },
        { label: 'Stockholm' },
      ]}
      initialCenter={[59.3293, 18.0686]}
      initialZoom={12}
    />
  );
}
