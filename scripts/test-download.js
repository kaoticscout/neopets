#!/usr/bin/env node

/**
 * Test script to download a single image and see what works
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const TEST_URL = 'https://pets.neopets.com/cp/vk3clso7/1/4.png';
const OUTPUT_FILE = path.join(__dirname, '..', 'test-download.png');

async function testDownload() {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(TEST_URL);
    
    // Try with more comprehensive headers
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/png,image/*,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Referer': 'https://www.neopets.com/',
        'Origin': 'https://www.neopets.com',
        'Connection': 'keep-alive',
        'Sec-Fetch-Dest': 'image',
        'Sec-Fetch-Mode': 'no-cors',
        'Sec-Fetch-Site': 'same-site',
        'Cache-Control': 'max-age=0',
        'DNT': '1'
      }
    };
    
    console.log('Attempting to download:', TEST_URL);
    console.log('Headers:', JSON.stringify(options.headers, null, 2));
    
    const req = https.request(options, (response) => {
      console.log('\nResponse Status:', response.statusCode, response.statusMessage);
      console.log('Response Headers:', JSON.stringify(response.headers, null, 2));
      
      if (response.statusCode !== 200) {
        // Try to read the error response
        let errorData = '';
        response.on('data', (chunk) => {
          errorData += chunk.toString();
        });
        response.on('end', () => {
          console.log('Error Response Body:', errorData);
          reject(new Error(`Failed: ${response.statusCode} ${response.statusMessage}`));
        });
        return;
      }
      
      const fileStream = fs.createWriteStream(OUTPUT_FILE);
      let downloadedBytes = 0;
      
      response.on('data', (chunk) => {
        downloadedBytes += chunk.length;
      });
      
      response.pipe(fileStream);
      
      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`\n✅ Successfully downloaded ${downloadedBytes} bytes to ${OUTPUT_FILE}`);
        resolve();
      });
      
      fileStream.on('error', (err) => {
        fs.unlink(OUTPUT_FILE, () => {});
        reject(err);
      });
    });
    
    req.on('error', (err) => {
      console.log('Request Error:', err.message);
      reject(err);
    });
    
    req.end();
  });
}

testDownload()
  .then(() => {
    console.log('\n✅ Download successful!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Download failed:', error.message);
    process.exit(1);
  });

