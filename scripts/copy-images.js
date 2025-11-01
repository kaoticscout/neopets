const fs = require('fs-extra');
const path = require('path');

async function copyImages() {
  const source = path.join(__dirname, '..', 'data', 'neopets', 'art');
  const dest = path.join(__dirname, '..', 'public', 'neopets', 'art');
  
  console.log('📁 Copying images from data/neopets/art to public/neopets/art...');
  
  try {
    await fs.ensureDir(dest);
    await fs.copy(source, dest);
    console.log('✅ Images copied to public directory');
  } catch (error) {
    console.error('❌ Error copying images:', error);
    process.exit(1);
  }
}

copyImages();

