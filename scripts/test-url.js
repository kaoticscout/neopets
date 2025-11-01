#!/usr/bin/env node

/**
 * Quick test script to output sample URLs for verification
 */

const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const BASE_URL = 'https://pets.neopets.com/cp';

async function testUrls() {
  try {
    // Read one pet file (acara)
    const filePath = path.join(DATA_DIR, 'acara.json');
    const data = JSON.parse(await fs.readFile(filePath, 'utf-8'));
    
    console.log('Sample URLs from acara.json:\n');
    
    // Get first few colors as samples
    const colors = Object.entries(data).slice(0, 5);
    
    for (const [paintName, colorData] of colors) {
      if (colorData.female) {
        const url = `${BASE_URL}/${colorData.female}/1/4.png`;
        console.log(`Pet: acara`);
        console.log(`Color: ${paintName}`);
        console.log(`Gender: female`);
        console.log(`ID: ${colorData.female}`);
        console.log(`URL: ${url}`);
        console.log('');
      }
      
      if (colorData.male) {
        const url = `${BASE_URL}/${colorData.male}/1/4.png`;
        console.log(`Pet: acara`);
        console.log(`Color: ${paintName}`);
        console.log(`Gender: male`);
        console.log(`ID: ${colorData.male}`);
        console.log(`URL: ${url}`);
        console.log('');
      }
      
      // Just show first 2 colors
      if (colors.indexOf([paintName, colorData]) >= 1) break;
    }
    
    // Also show the shadow one specifically (which the user mentioned)
    if (data.shadow) {
      console.log('\n=== Shadow color (user example) ===');
      if (data.shadow.female) {
        console.log(`Female URL: ${BASE_URL}/${data.shadow.female}/1/4.png`);
      }
      if (data.shadow.male) {
        console.log(`Male URL: ${BASE_URL}/${data.shadow.male}/1/4.png`);
      }
    }
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

testUrls();

