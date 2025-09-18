import { Metadata } from 'next';
import { City } from '@/app/data/cities';

export const generateCityMetadata = (city: City): Metadata => ({
  title: `Bästa Kebab i ${city.name} | Kebabkartan`,
  description: `Hitta de bästa kebabställena i ${city.name}. Läs recensioner, se betyg och upptäck nya favoriter. Kebabkartan hjälper dig hitta perfekt kebab i ${city.name}.`,
  keywords: city.keywords,
  openGraph: {
    title: `Bästa Kebab i ${city.name} | Kebabkartan`,
    description: `Hitta de bästa kebabställena i ${city.name}. Läs recensioner, se betyg och upptäck nya favoriter.`,
    images: ['/static/logo.png'],
  },
});

export const generatePlaceMetadata = (place: any): Metadata => {
  const title = `Kebabkartan - ${place.name} | Betygsätt och recensera | Kebabkartan`;
  const description = `Utforska ${place.name} på ${place.address}. Betygsätt och dela din erfarenhet av deras kebab. Läs recensioner och se betyg från andra besökare.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.kebabkartan.se/place/${place.id}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.kebabkartan.se/place/${place.id}`,
      type: 'website',
      images: [
        {
          url: '/static/logo.png',
          width: 1200,
          height: 630,
          alt: `${place.name} - Kebabställe på ${place.address}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/static/logo.png'],
    },
  };
};
