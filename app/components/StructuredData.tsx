'use client';

interface StructuredDataProps {
  type: 'website' | 'restaurant' | 'breadcrumb';
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
