'use client';

import { useEffect } from 'react';

export default function LCPOptimizer() {
  useEffect(() => {
    // Optimize LCP (Largest Contentful Paint)
    const optimizeLCP = () => {
      // Preload the largest content element
      const lcpElement = document.querySelector('.leaflet-container') || 
                        document.querySelector('main') || 
                        document.querySelector('body');
      
      if (lcpElement) {
        // Add critical CSS inline for above-the-fold content
        const criticalCSS = `
          .leaflet-container { 
            width: 100% !important; 
            position: relative; 
          }
          main { 
            height: 100vh; 
            width: 100vw; 
          }
        `;
        
        const style = document.createElement('style');
        style.textContent = criticalCSS;
        document.head.appendChild(style);
      }

      // Optimize font loading for LCP (only if not already loaded)
      if (!document.querySelector('link[href*="fonts.googleapis.com"]')) {
        const fontLink = document.createElement('link');
        fontLink.rel = 'preload';
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
        fontLink.as = 'style';
        document.head.appendChild(fontLink);
      }

      // Only preload map placeholder if there's actually a map on the page
      const hasMap = document.querySelector('.leaflet-container') !== null;

      if (hasMap) {
        const mapPlaceholder = '/static/map-placeholder.png';
        if (!document.querySelector(`link[href="${mapPlaceholder}"]`)) {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'image';
          link.href = mapPlaceholder;
          link.fetchPriority = 'high';
          document.head.appendChild(link);
        }
      }
    };

    // Run LCP optimization immediately
    optimizeLCP();

    // Monitor LCP in real-time
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('🚀 LCP Optimized:', Math.round(lastEntry.startTime) + 'ms');
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    }
  }, []);

  return null;
}
