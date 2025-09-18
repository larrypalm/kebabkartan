'use client';

interface StructuredDataProps {
  type: 'website' | 'restaurant' | 'breadcrumb' | 'localBusiness' | 'review' | 'faq';
  data: any;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  const getStructuredData = () => {
    switch (type) {
      case 'website':
        return {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Kebabkartan',
          url: 'https://www.kebabkartan.se',
          description: 'Hitta och betygsätt din favorit kebab i Sverige. Utforska kebabställen nära dig, läs recensioner och dela dina erfarenheter.',
          inLanguage: 'sv-SE',
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: 'https://www.kebabkartan.se/?q={search_term_string}'
            },
            'query-input': 'required name=search_term_string'
          }
        };
      
      case 'restaurant':
        return data;
      
      case 'breadcrumb':
        return {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: data.map((item: any, index: number) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: `https://www.kebabkartan.se${item.href}`
          }))
        };
      
      case 'localBusiness':
        return {
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: data.name,
          description: data.description,
          address: {
            '@type': 'PostalAddress',
            streetAddress: data.address,
            addressLocality: data.city,
            addressCountry: 'SE'
          },
          telephone: data.phone,
          url: data.website,
          priceRange: data.priceRange,
          servesCuisine: 'Turkish',
          aggregateRating: data.rating ? {
            '@type': 'AggregateRating',
            ratingValue: data.rating,
            reviewCount: data.reviewCount || 1
          } : undefined
        };
      
      case 'review':
        return {
          '@context': 'https://schema.org',
          '@type': 'Review',
          itemReviewed: {
            '@type': 'Restaurant',
            name: data.restaurantName
          },
          author: {
            '@type': 'Person',
            name: data.authorName
          },
          reviewRating: {
            '@type': 'Rating',
            ratingValue: data.rating,
            bestRating: 5
          },
          reviewBody: data.reviewText,
          datePublished: data.datePublished
        };
      
      case 'faq':
        return {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: data.map((faq: any) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer
            }
          }))
        };
      
      default:
        return data;
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getStructuredData())
      }}
    />
  );
}
