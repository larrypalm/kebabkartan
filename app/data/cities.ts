export interface City {
  name: string;
  path: string;
  coordinates: [number, number];
  zoom: number;
  description: string;
  keywords: string[];
}

export const cities: City[] = [
  {
    name: 'Stockholm',
    path: '/kebab-stockholm',
    coordinates: [59.3293, 18.0686],
    zoom: 12,
    description: 'Upptäck Stockholms bästa kebabställen, pizzerior och falafelställen med hjälp av våra användares recensioner och betyg.',
    keywords: ['kebab Stockholm', 'pizza Stockholm', 'falafel Stockholm', 'bästa kebab Stockholm', 'bästa pizza Stockholm', 'bästa falafel Stockholm', 'kebab restaurang Stockholm', 'pizzeria Stockholm', 'falafelställe Stockholm', 'kebab nära mig Stockholm', 'pizza nära mig Stockholm', 'falafel nära mig Stockholm', 'kebab recensioner Stockholm', 'pizza recensioner Stockholm', 'falafel recensioner Stockholm']
  },
  {
    name: 'Göteborg',
    path: '/kebab-goteborg',
    coordinates: [57.7089, 11.9746],
    zoom: 12,
    description: 'Upptäck Göteborgs bästa kebabställen, pizzerior och falafelställen med hjälp av våra användares recensioner och betyg.',
    keywords: ['kebab Göteborg', 'pizza Göteborg', 'falafel Göteborg', 'bästa kebab Göteborg', 'bästa pizza Göteborg', 'bästa falafel Göteborg', 'kebabsås Göteborg', 'kebabtallrik Göteborg', 'bästa kebabsåsen Göteborg', 'kebab restaurang Göteborg', 'pizzeria Göteborg', 'falafelställe Göteborg', 'kebab nära mig Göteborg', 'pizza nära mig Göteborg', 'falafel nära mig Göteborg', 'kebab recensioner Göteborg', 'pizza recensioner Göteborg', 'falafel recensioner Göteborg']
  },
  {
    name: 'Malmö',
    path: '/kebab-malmo',
    coordinates: [55.6050, 13.0038],
    zoom: 12,
    description: 'Upptäck Malmös bästa kebabställen, pizzerior och falafelställen med hjälp av våra användares recensioner och betyg.',
    keywords: ['kebab Malmö', 'pizza Malmö', 'falafel Malmö', 'bästa kebab Malmö', 'bästa pizza Malmö', 'bästa falafel Malmö', 'kebab restaurang Malmö', 'pizzeria Malmö', 'falafelställe Malmö', 'kebab nära mig Malmö', 'pizza nära mig Malmö', 'falafel nära mig Malmö', 'kebab recensioner Malmö', 'pizza recensioner Malmö', 'falafel recensioner Malmö']
  },
  {
    name: 'Jönköping',
    path: '/kebab-jonkoping',
    coordinates: [57.7826, 14.1618],
    zoom: 12,
    description: 'Upptäck Jönköpings bästa kebabställen, pizzerior och falafelställen med hjälp av våra användares recensioner och betyg.',
    keywords: ['kebab Jönköping', 'pizza Jönköping', 'falafel Jönköping', 'bästa kebab Jönköping', 'bästa pizza Jönköping', 'bästa falafel Jönköping', 'kebab restaurang Jönköping', 'pizzeria Jönköping', 'falafelställe Jönköping', 'kebab nära mig Jönköping', 'pizza nära mig Jönköping', 'falafel nära mig Jönköping', 'kebab recensioner Jönköping', 'pizza recensioner Jönköping', 'falafel recensioner Jönköping']
  },
  {
    name: 'Linköping',
    path: '/kebab-linkoping',
    coordinates: [58.4108, 15.6214],
    zoom: 12,
    description: 'Upptäck Linköpings bästa kebabställen, pizzerior och falafelställen med hjälp av våra användares recensioner och betyg.',
    keywords: ['kebab Linköping', 'pizza Linköping', 'falafel Linköping', 'bästa kebab Linköping', 'bästa pizza Linköping', 'bästa falafel Linköping', 'kebab restaurang Linköping', 'pizzeria Linköping', 'falafelställe Linköping', 'kebab nära mig Linköping', 'pizza nära mig Linköping', 'falafel nära mig Linköping', 'kebab recensioner Linköping', 'pizza recensioner Linköping', 'falafel recensioner Linköping']
  },
  {
    name: 'Lund',
    path: '/kebab-lund',
    coordinates: [55.7047, 13.1910],
    zoom: 12,
    description: 'Upptäck Lunds bästa kebabställen, pizzerior och falafelställen med hjälp av våra användares recensioner och betyg.',
    keywords: ['kebab Lund', 'pizza Lund', 'falafel Lund', 'bästa kebab Lund', 'bästa pizza Lund', 'bästa falafel Lund', 'kebab restaurang Lund', 'pizzeria Lund', 'falafelställe Lund', 'kebab nära mig Lund', 'pizza nära mig Lund', 'falafel nära mig Lund', 'kebab recensioner Lund', 'pizza recensioner Lund', 'falafel recensioner Lund']
  }
];

export const getCityByPath = (path: string): City | undefined => {
  return cities.find(city => city.path === path);
};

export const getCityByName = (name: string): City | undefined => {
  return cities.find(city => city.name.toLowerCase() === name.toLowerCase());
};
