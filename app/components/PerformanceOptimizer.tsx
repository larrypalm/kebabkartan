'use client';

import { useEffect } from 'react';

export default function PerformanceOptimizer() {
  useEffect(() => {
    // Optimize resource loading
    const optimizeResources = () => {
      // Preload critical resources (only if not already preloaded)
      const criticalResources = [
        '/static/logo.png',
        '/static/map-placeholder.png'
      ];

      criticalResources.forEach(resource => {
        if (!document.querySelector(`link[href="${resource}"]`)) {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'image';
          link.href = resource;
          document.head.appendChild(link);
        }
      });

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
