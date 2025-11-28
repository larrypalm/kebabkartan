'use client';

import { useEffect } from 'react';

export default function PerformanceOptimizer() {
  useEffect(() => {
    // Optimize resource loading
    const optimizeResources = () => {
      // Only preload map placeholder if there's actually a map on the page
      const hasMap = document.querySelector('.leaflet-container') !== null;

      if (hasMap) {
        const mapPlaceholder = '/static/map-placeholder.png';
        if (!document.querySelector(`link[href="${mapPlaceholder}"]`)) {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'image';
          link.href = mapPlaceholder;
          document.head.appendChild(link);
        }
      }

      // Optimize map tiles loading
      const mapTiles = document.querySelectorAll('img[src*="tile.openstreetmap.org"]');
      mapTiles.forEach(img => {
        (img as HTMLImageElement).loading = 'lazy';
        (img as HTMLImageElement).decoding = 'async';
        (img as HTMLImageElement).fetchPriority = 'low';
      });

      // Optimize images
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        const imgElement = img as HTMLImageElement;
        if (!imgElement.loading) {
          imgElement.loading = 'lazy';
        }
        if (!imgElement.decoding) {
          imgElement.decoding = 'async';
        }
      });
    };

    // Run optimization after initial load
    const timer = setTimeout(optimizeResources, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return null;
}
