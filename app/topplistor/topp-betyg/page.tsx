import { Metadata } from 'next';
import TopListClient from '@/app/components/TopListClient';

export const metadata: Metadata = {
  title: 'Högsta Totalbetyg | Topplistor | Kebabkartan',
  description: 'Sveriges bästa kebab, pizza och falafel baserat på totalbetyg från användare. Upptäck de högst rankade restaurangerna i hela Sverige.',
  openGraph: {
    title: 'Högsta Totalbetyg | Topplistor | Kebabkartan',
    description: 'Sveriges bästa kebab, pizza och falafel baserat på totalbetyg från användare. Upptäck de högst rankade restaurangerna i hela Sverige.',
  },
};

export default function ToppBetyg() {
  return (
    <TopListClient
      title="Högsta Totalbetyg i Sverige"
      description="Upptäck Sveriges bästa kebab, pizza och falafel baserat på totalbetyg från användare. Dessa restauranger har fått högst betyg av våra användare."
      sortBy="rating"
      breadcrumbs={[
        { label: 'Kebabkartan.se', href: '/' },
        { label: 'Topplistor', href: '/topplistor' },
        { label: 'Högsta Totalbetyg' },
      ]}
    />
  );
}
