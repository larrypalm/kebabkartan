export default function imageLoader({ src, width, quality }) {
  // For static images, return optimized URLs
  if (src.startsWith('/static/')) {
    return `${src}?w=${width}&q=${quality || 75}`;
  }
  
  // For external images, use a CDN or optimization service
  if (src.startsWith('http')) {
    return `https://images.weserv.nl/?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 75}&f=webp`;
  }
  
  // Default fallback
  return src;
}
