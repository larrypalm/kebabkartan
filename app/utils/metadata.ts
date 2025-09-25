import { Metadata } from 'next';
import { City } from '@/app/data/cities';

export const generateCityMetadata = (city: City): Metadata => ({
  title: `Bästa Kebab i ${city.name} | Kebabkartan`,
  description: `🔥 Upptäck ${city.name}s bästa kebabställen! Läs äkta recensioner, se betyg från lokala experter och hitta din nya favorit. Gratis guide till toppkvalitet kebab i ${city.name}.`,
  keywords: city.keywords,
  openGraph: {
    title: `Bästa Kebab i ${city.name} | Kebabkartan`,
    description: `🔥 Upptäck ${city.name}s bästa kebabställen! Läs äkta recensioner, se betyg från lokala experter och hitta din nya favorit.`,
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
