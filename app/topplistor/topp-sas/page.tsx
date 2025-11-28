import { Metadata } from 'next';
import TopListClient from '@/app/components/TopListClient';

export const metadata: Metadata = {
  title: 'Bästa Såsbetyg | Topplistor | Kebabkartan',
  description: 'Sveriges bästa såser! Upptäck restauranger med de högst rankade såserna baserat på användarrecensioner.',
  openGraph: {
    title: 'Bästa Såsbetyg | Topplistor | Kebabkartan',
    description: 'Sveriges bästa såser! Upptäck restauranger med de högst rankade såserna baserat på användarrecensioner.',
  },
};

export default function ToppSas() {
  return (
    <TopListClient
      title="Bästa Såsbetyg i Sverige"
      description="Upptäck restaurangerna med de absolut bästa såserna i Sverige! Dessa ställen har fått högst betyg för sina såser av våra användare."
      sortBy="sauceRating"
      breadcrumbs={[
        { label: 'Kebabkartan.se', href: '/' },
        { label: 'Topplistor', href: '/topplistor' },
        { label: 'Bästa Såsbetyg' },
      ]}
    />
  );
}
