import sharp from 'sharp';

// Rasterize the repo-native SVG so social platforms can use a standard PNG.
await sharp('public/social-card.svg').png().toFile('public/social-card.png');
console.log('Generated 1200 × 630 social image.');
