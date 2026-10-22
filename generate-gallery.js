const fs = require('fs');
const path = require('path');

const folder = path.join(__dirname, 'gallery-images');
const outputFile = path.join(__dirname, 'gallery-data.js');
const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'];

const files = fs.existsSync(folder)
  ? fs.readdirSync(folder)
      .filter((file) => {
        const lower = file.toLowerCase();
        const isImage = allowedExtensions.some((ext) => lower.endsWith(ext));
        const isDuplicate = /\s+copy\b/i.test(file);
        return isImage && !isDuplicate;
      })
      .sort((a, b) => a.localeCompare(b))
  : [];

const images = files.map((file) => {
  const fileName = path.basename(file, path.extname(file));
  const title = fileName
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return {
    src: `gallery-images/${file}`,
    alt: title,
    title,
  };
});

const output = `window.galleryImages = ${JSON.stringify(images, null, 2)};\n`;
fs.writeFileSync(outputFile, output, 'utf8');
console.log(`Generated ${images.length} gallery image(s) in ${outputFile}`);
