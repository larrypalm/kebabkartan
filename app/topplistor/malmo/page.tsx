import { Metadata } from 'next';
import TopListClient from '@/app/components/TopListClient';

export const metadata: Metadata = {
  title: 'Bästa Kebab i Malmö | Topplistor | Kebabkartan',
  description: 'Upptäck Malmös bästa kebab, pizza och falafel baserat på användarrecensioner. Här är de högst rankade restaurangerna i Malmö.',
  openGraph: {
    title: 'Bästa Kebab i Malmö | Topplistor | Kebabkartan',
    description: 'Upptäck Malmös bästa kebab, pizza och falafel baserat på användarrecensioner.',
  },
};

export default function MalmoTopplista() {
  return (
    <TopListClient
      title="Bästa Kebab i Malmö"
      description="Upptäck de högst rankade restaurangerna i Malmö baserat på totalbetyg från användare. Här hittar du Skånes bästa kebab, pizza och falafel."
      sortBy="rating"
      cityFilter="Malmö"
      breadcrumbs={[
        { label: 'Kebabkartan.se', href: '/' },
        { label: 'Topplistor', href: '/topplistor' },
        { label: 'Malmö' },
      ]}
      initialCenter={[55.6050, 13.0038]}
      initialZoom={12}
    />
  );
}
