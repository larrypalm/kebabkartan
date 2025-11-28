'use client';

import { useEffect } from 'react';

export default function MaterialIconsLoader() {
  useEffect(() => {
    // Load Material Symbols font asynchronously
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap';
    link.rel = 'stylesheet';
    link.media = 'all';
    document.head.appendChild(link);
  }, []);

  return null;
}
