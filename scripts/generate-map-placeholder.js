const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Center of Sweden at zoom 5
const CENTER_LAT = 62.5;
const CENTER_LON = 16.5;
const ZOOM = 5;
const GRID_SIZE = 5;
const OUTPUT_PATH = path.join(__dirname, '../public/static/map-placeholder.png');

// Helper to convert lat/lon to tile x/y at a given zoom
function latLonToTileXY(lat, lon, zoom) {
  const latRad = lat * Math.PI / 180;
  const n = Math.pow(2, zoom);
  const x = Math.floor((lon + 180) / 360 * n);
  const y = Math.floor((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * n);
  return { x, y };
}

// Provided tile URLs
const TILE_URLS = [
  "https://tile.openstreetmap.org/5/17/8.png",
  "https://tile.openstreetmap.org/5/17/7.png",
  "https://tile.openstreetmap.org/5/16/8.png",
  "https://tile.openstreetmap.org/5/18/8.png",
  "https://tile.openstreetmap.org/5/17/9.png",
  "https://tile.openstreetmap.org/5/16/7.png",
  "https://tile.openstreetmap.org/5/18/7.png",
  "https://tile.openstreetmap.org/5/16/9.png",
  "https://tile.openstreetmap.org/5/18/9.png",
  "https://tile.openstreetmap.org/5/17/6.png",
  "https://tile.openstreetmap.org/5/15/8.png",
  "https://tile.openstreetmap.org/5/19/8.png",
  "https://tile.openstreetmap.org/5/17/10.png",
  "https://tile.openstreetmap.org/5/16/6.png",
  "https://tile.openstreetmap.org/5/18/6.png",
  "https://tile.openstreetmap.org/5/15/7.png",
  "https://tile.openstreetmap.org/5/19/7.png",
  "https://tile.openstreetmap.org/5/15/9.png",
  "https://tile.openstreetmap.org/5/19/9.png",
  "https://tile.openstreetmap.org/5/16/10.png",
  "https://tile.openstreetmap.org/5/18/10.png",
  "https://tile.openstreetmap.org/5/15/6.png",
  "https://tile.openstreetmap.org/5/19/6.png",
  "https://tile.openstreetmap.org/5/15/10.png",
  "https://tile.openstreetmap.org/5/19/10.png"
];

// Parse tile URLs to get their (x, y) positions
function parseTileUrl(url) {
  const match = url.match(/\/5\/(\d+)\/(\d+)\.png$/);
  if (!match) throw new Error(`Invalid tile URL: ${url}`);
  return { x: parseInt(match[1], 10), y: parseInt(match[2], 10), url };
}

async function downloadTile(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  // Calculate center tile
  const { x: centerX, y: centerY } = latLonToTileXY(CENTER_LAT, CENTER_LON, ZOOM);

  // Build grid of required tile coordinates
  const half = Math.floor(GRID_SIZE / 2);
  const grid = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const x = centerX - half + col;
      const y = centerY - half + row;
      grid.push({ x, y });
    }
  }

  // Map provided URLs to their (x, y)
  const urlTiles = TILE_URLS.map(parseTileUrl);

  // For each grid position, find the matching tile URL
  const gridTiles = grid.map(({ x, y }) => {
    const found = urlTiles.find(t => t.x === x && t.y === y);
    if (!found) throw new Error(`Missing tile for x=${x}, y=${y}`);
    return found.url;
  });

  // Download all tiles in grid order
  const tiles = await Promise.all(gridTiles.map(downloadTile));

  // Get tile size from the first tile
  const tileMeta = await sharp(tiles[0]).metadata();
  const tileWidth = tileMeta.width;
  const tileHeight = tileMeta.height;

  // Prepare composite array
  const composite = [];
  for (let i = 0; i < tiles.length; i++) {
    const x = (i % GRID_SIZE) * tileWidth;
    const y = Math.floor(i / GRID_SIZE) * tileHeight;
    composite.push({ input: tiles[i], left: x, top: y });
  }

  // Create the final image
  await sharp({
    create: {
      width: tileWidth * GRID_SIZE,
      height: tileHeight * GRID_SIZE,
      channels: 3,
      background: { r: 255, g: 255, b: 255 }
    }
  })
    .composite(composite)
    .png()
    .toFile(OUTPUT_PATH);

  console.log(`Map placeholder saved to ${OUTPUT_PATH}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
}); 