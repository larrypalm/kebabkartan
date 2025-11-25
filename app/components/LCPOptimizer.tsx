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

      // Preload critical images (only if not already preloaded)
      const criticalImages = [
        '/static/logo.png',
        '/static/map-placeholder.png'
      ];

      criticalImages.forEach(src => {
        if (!document.querySelector(`link[href="${src}"]`)) {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'image';
          link.href = src;
          link.fetchPriority = 'high';
          document.head.appendChild(link);
        }
      });
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
