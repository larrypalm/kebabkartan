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
    description: 'Upptäck Stockholms bästa kebabställen med hjälp av våra användares recensioner och betyg.',
    keywords: ['kebab Stockholm', 'bästa kebab Stockholm', 'kebab restaurang Stockholm', 'kebab nära mig Stockholm', 'kebab recensioner Stockholm']
  },
  {
    name: 'Göteborg',
    path: '/kebab-goteborg',
    coordinates: [57.7089, 11.9746],
    zoom: 12,
    description: 'Upptäck Göteborgs bästa kebabställen med hjälp av våra användares recensioner och betyg.',
    keywords: ['kebab Göteborg', 'bästa kebab Göteborg', 'kebab restaurang Göteborg', 'kebab nära mig Göteborg', 'kebab recensioner Göteborg']
  },
  {
    name: 'Malmö',
    path: '/kebab-malmo',
    coordinates: [55.6050, 13.0038],
    zoom: 12,
    description: 'Upptäck Malmös bästa kebabställen med hjälp av våra användares recensioner och betyg.',
    keywords: ['kebab Malmö', 'bästa kebab Malmö', 'kebab restaurang Malmö', 'kebab nära mig Malmö', 'kebab recensioner Malmö']
  },
  {
    name: 'Jönköping',
    path: '/kebab-jonkoping',
    coordinates: [57.7826, 14.1618],
    zoom: 12,
    description: 'Upptäck Jönköpings bästa kebabställen med hjälp av våra användares recensioner och betyg.',
    keywords: ['kebab Jönköping', 'bästa kebab Jönköping', 'kebab restaurang Jönköping', 'kebab nära mig Jönköping', 'kebab recensioner Jönköping']
  },
  {
    name: 'Linköping',
    path: '/kebab-linkoping',
    coordinates: [58.4108, 15.6214],
    zoom: 12,
    description: 'Upptäck Linköpings bästa kebabställen med hjälp av våra användares recensioner och betyg.',
    keywords: ['kebab Linköping', 'bästa kebab Linköping', 'kebab restaurang Linköping', 'kebab nära mig Linköping', 'kebab recensioner Linköping']
  },
  {
    name: 'Lund',
    path: '/kebab-lund',
    coordinates: [55.7047, 13.1910],
    zoom: 12,
    description: 'Upptäck Lunds bästa kebabställen med hjälp av våra användares recensioner och betyg.',
    keywords: ['kebab Lund', 'bästa kebab Lund', 'kebab restaurang Lund', 'kebab nära mig Lund', 'kebab recensioner Lund']
  }
];

export const getCityByPath = (path: string): City | undefined => {
  return cities.find(city => city.path === path);
};

export const getCityByName = (name: string): City | undefined => {
  return cities.find(city => city.name.toLowerCase() === name.toLowerCase());
};
