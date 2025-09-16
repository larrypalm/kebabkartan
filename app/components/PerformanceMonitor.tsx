'use client';

import { useEffect } from 'react';

export default function PerformanceMonitor() {
  useEffect(() => {
    // Monitor Core Web Vitals
    const monitorPerformance = () => {
      // Monitor Largest Contentful Paint (LCP)
      if ('PerformanceObserver' in window) {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          console.log('🎯 LCP (Largest Contentful Paint):', Math.round(lastEntry.startTime) + 'ms');
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // Monitor First Input Delay (FID)
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            const fid = entry.processingStart - entry.startTime;
            console.log('⚡ FID (First Input Delay):', Math.round(fid) + 'ms');
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });

        // Monitor Cumulative Layout Shift (CLS)
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          });
          console.log('📐 CLS (Cumulative Layout Shift):', clsValue.toFixed(3));
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      }

      // Monitor resource loading times
      const resourceTiming = performance.getEntriesByType('resource');
      resourceTiming.forEach((resource) => {
        if (resource.duration > 1000) { // Log resources taking more than 1 second
          console.warn('🐌 Slow resource:', resource.name, Math.round(resource.duration) + 'ms');
        }
      });

      // Log overall performance summary
      console.log('📊 Performance Summary:');
      console.log('Total resources loaded:', resourceTiming.length);
      console.log('Average load time:', Math.round(resourceTiming.reduce((sum, r) => sum + r.duration, 0) / resourceTiming.length) + 'ms');
    };

    // Run monitoring after page load
    if (document.readyState === 'complete') {
      monitorPerformance();
    } else {
      window.addEventListener('load', monitorPerformance);
    }

    return () => {
      window.removeEventListener('load', monitorPerformance);
    };
  }, []);

  return null;
}
