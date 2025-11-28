import { Metadata } from 'next';
import TopListClient from '@/app/components/TopListClient';

export const metadata: Metadata = {
  title: 'Bästa Kebab i Lund | Topplistor | Kebabkartan',
  description: 'Upptäck Lunds bästa kebab, pizza och falafel baserat på användarrecensioner. Här är de högst rankade restaurangerna i Lund.',
  openGraph: {
    title: 'Bästa Kebab i Lund | Topplistor | Kebabkartan',
    description: 'Upptäck Lunds bästa kebab, pizza och falafel baserat på användarrecensioner.',
  },
};

export default function LundTopplista() {
  return (
    <TopListClient
      title="Bästa Kebab i Lund"
      description="Upptäck de högst rankade restaurangerna i Lund baserat på totalbetyg från användare. Här hittar du Lunds bästa kebab, pizza och falafel."
      sortBy="rating"
      cityFilter="Lund"
      breadcrumbs={[
        { label: 'Kebabkartan.se', href: '/' },
        { label: 'Topplistor', href: '/topplistor' },
        { label: 'Lund' },
      ]}
      initialCenter={[55.7047, 13.1910]}
      initialZoom={12}
    />
  );
}
