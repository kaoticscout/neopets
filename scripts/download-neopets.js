#!/usr/bin/env node

/**
 * Script to download all Neopet images from Neopets.com
 * Downloads images for all pet species, colors, and genders
 */

const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const https = require('https');
const { URL } = require('url');

// Configuration
const BASE_URL = 'https://pets.neopets.com/cp';
const DATA_DIR = path.join(__dirname, '..', 'data');
const OUTPUT_DIR = path.join(__dirname, '..', 'data', 'neopets', 'art');
const RATE_LIMIT_MS = 2500; // 2.5 seconds between requests (slightly slower to avoid rate limiting)
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000;
const RESPONSE_TIMEOUT_MS = 30000; // 30 seconds for full response

// Statistics
let stats = {
  total: 0,
  downloaded: 0,
  skipped: 0,
  failed: 0,
  startTime: Date.now()
};

/**
 * Sleep for specified milliseconds
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Download a file from URL and save to path
 */
async function downloadFile(urlString, filePath, retries = MAX_RETRIES) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(filePath);
    let timeout;
    
    // Parse URL properly
    let urlObj;
    try {
      urlObj = new URL(urlString);
    } catch (error) {
      return reject(new Error(`Invalid URL: ${urlString}`));
    }
    
    // Ensure directory exists
    fsPromises.mkdir(dir, { recursive: true }).then(() => {
      const options = {
        hostname: urlObj.hostname,
        path: urlObj.pathname,
        method: 'GET',
        timeout: 30000, // 30 second timeout
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
      
      const req = https.request(options, (response) => {
        // Clear request timeout on response
        if (timeout) clearTimeout(timeout);
        
        // Set response timeout - if response takes too long, abort
        let responseTimeout = setTimeout(() => {
          response.destroy();
          req.destroy();
          if (retries > 0) {
            return sleep(RETRY_DELAY_MS).then(() => {
              return downloadFile(urlString, filePath, retries - 1)
                .then(resolve)
                .catch(reject);
            });
          }
          reject(new Error('Response timeout - no data received'));
        }, RESPONSE_TIMEOUT_MS);
        
        // Handle redirects
        if (response.statusCode === 301 || response.statusCode === 302) {
          clearTimeout(responseTimeout);
          const redirectUrl = response.headers.location;
          const absoluteUrl = redirectUrl.startsWith('http') 
            ? redirectUrl 
            : `${urlObj.protocol}//${urlObj.hostname}${redirectUrl}`;
          return downloadFile(absoluteUrl, filePath, retries)
            .then(resolve)
            .catch(reject);
        }
        
        if (response.statusCode !== 200) {
          clearTimeout(responseTimeout);
          if (retries > 0) {
            // Retry on failure
            return sleep(RETRY_DELAY_MS).then(() => {
              return downloadFile(urlString, filePath, retries - 1)
                .then(resolve)
                .catch(reject);
            });
          }
          return reject(new Error(`Failed to download: ${response.statusCode} ${response.statusMessage}`));
        }
        
        const fileStream = require('fs').createWriteStream(filePath);
        let bytesReceived = 0;
        
        // Track data received to detect stalled downloads
        response.on('data', (chunk) => {
          bytesReceived += chunk.length;
          // Reset timeout each time we receive data
          clearTimeout(responseTimeout);
          responseTimeout = setTimeout(() => {
            response.destroy();
            req.destroy();
            fileStream.close();
            require('fs').unlink(filePath, () => {});
            if (retries > 0) {
              return sleep(RETRY_DELAY_MS).then(() => {
                return downloadFile(urlString, filePath, retries - 1)
                  .then(resolve)
                  .catch(reject);
              });
            }
            reject(new Error('Response stalled - no data received for too long'));
          }, RESPONSE_TIMEOUT_MS);
        });
        
        response.pipe(fileStream);
        
        fileStream.on('finish', () => {
          clearTimeout(responseTimeout);
          fileStream.close();
          resolve();
        });
        
        fileStream.on('error', (err) => {
          clearTimeout(responseTimeout);
          require('fs').unlink(filePath, () => {}); // Delete partial file
          reject(err);
        });
        
        response.on('error', (err) => {
          clearTimeout(responseTimeout);
          fileStream.close();
          require('fs').unlink(filePath, () => {});
          reject(err);
        });
      });
      
      // Set timeout for the request connection
      timeout = setTimeout(() => {
        req.destroy();
        if (retries > 0) {
          return sleep(RETRY_DELAY_MS).then(() => {
            return downloadFile(urlString, filePath, retries - 1)
              .then(resolve)
              .catch(reject);
          });
        }
        reject(new Error('Connection timeout'));
      }, 15000); // 15 seconds to establish connection
      
      req.on('error', (err) => {
        if (timeout) clearTimeout(timeout);
        if (retries > 0) {
          return sleep(RETRY_DELAY_MS).then(() => {
            return downloadFile(urlString, filePath, retries - 1)
              .then(resolve)
              .catch(reject);
          });
        }
        reject(err);
      });
      
      req.end();
    }).catch(reject);
  });
}

/**
 * Check if file already exists
 */
async function fileExists(filePath) {
  try {
    await fsPromises.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Fast synchronous file existence check (for skipping already-downloaded files)
 */
function fileExistsSync(filePath) {
  try {
    require('fs').accessSync(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Download image for a specific pet, color, and gender
 */
async function downloadNeopetImage(petName, paintName, gender, id) {
  const url = `${BASE_URL}/${id}/1/4.png`;
  const filePath = path.join(OUTPUT_DIR, petName, gender, `${paintName}.png`);
  
  // File existence already checked before calling this function
  // Just download the file
  try {
    await downloadFile(url, filePath);
    stats.downloaded++;
    return { success: true, skipped: false };
  } catch (error) {
    stats.failed++;
    return { success: false, skipped: false, error: error.message };
  }
}

/**
 * Process a single pet JSON file
 */
async function processPetFile(filename) {
  const petName = path.basename(filename, '.json');
  const filePath = path.join(DATA_DIR, filename);
  
  console.log(`\n📦 Processing ${petName}...`);
  
  try {
    const data = JSON.parse(await fsPromises.readFile(filePath, 'utf-8'));
    const colors = Object.entries(data);
    
    let petStats = {
      total: 0,
      downloaded: 0,
      skipped: 0,
      failed: 0
    };
    
    let colorIndex = 0;
    let skippedCount = 0;
    
    for (const [paintName, colorData] of colors) {
      colorIndex++;
      try {
        // Download female variant
        if (colorData.female) {
          petStats.total++;
          stats.total++;
          
          const filePath = path.join(OUTPUT_DIR, petName, 'female', `${paintName}.png`);
          
          // Fast check if file exists (synchronous for speed) - no delay for skipped files
          if (fileExistsSync(filePath)) {
            petStats.skipped++;
            stats.skipped++;
            skippedCount++;
            // Skip silently and move to next variant
          } else {
            // File doesn't exist, download it
            process.stdout.write(`  Downloading ${paintName} (female)...\r`);
            const result = await downloadNeopetImage(petName, paintName, 'female', colorData.female);
            if (result.success && !result.skipped) {
              petStats.downloaded++;
              process.stdout.write(`  ✅ ${paintName} (female) downloaded\n`);
              await sleep(RATE_LIMIT_MS);
            } else {
              petStats.failed++;
              console.error(`  ❌ Failed: ${paintName} (female) - ${result.error || 'Unknown error'}`);
              await sleep(RATE_LIMIT_MS);
            }
          }
        }
        
        // Download male variant
        if (colorData.male) {
          petStats.total++;
          stats.total++;
          
          const filePath = path.join(OUTPUT_DIR, petName, 'male', `${paintName}.png`);
          
          // Fast check if file exists (synchronous for speed) - no delay for skipped files
          if (fileExistsSync(filePath)) {
            petStats.skipped++;
            stats.skipped++;
            skippedCount++;
            // Skip silently
          } else {
            // File doesn't exist, download it
            process.stdout.write(`  Downloading ${paintName} (male)...\r`);
            const result = await downloadNeopetImage(petName, paintName, 'male', colorData.male);
            if (result.success && !result.skipped) {
              petStats.downloaded++;
              process.stdout.write(`  ✅ ${paintName} (male) downloaded\n`);
              await sleep(RATE_LIMIT_MS);
            } else {
              petStats.failed++;
              console.error(`  ❌ Failed: ${paintName} (male) - ${result.error || 'Unknown error'}`);
              await sleep(RATE_LIMIT_MS);
            }
          }
        }
      } catch (error) {
        console.error(`  ⚠️  Error downloading ${petName} ${paintName}: ${error.message}`);
        petStats.failed++;
        stats.failed++;
        // Continue to next color even on error
      }
      
      // Progress indicator (only show every 10 colors to reduce output)
      if (colorIndex % 10 === 0 || colorIndex === colors.length) {
        const statusMsg = skippedCount > 0 ? ` (${skippedCount} skipped)` : '';
        process.stdout.write(`  Progress: ${colorIndex}/${colors.length} colors${statusMsg}...\r`);
      }
    }
    
    // Show skip count summary if there were skipped files
    if (skippedCount > 0) {
      process.stdout.write(`  ⏭️  Skipped ${skippedCount} existing files\n`);
    }
    
    console.log(`  ✅ ${petName}: ${petStats.downloaded} downloaded, ${petStats.skipped} skipped, ${petStats.failed} failed`);
    
  } catch (error) {
    console.error(`  ❌ Error processing ${petName}: ${error.message}`);
    console.error(`  Stack: ${error.stack}`);
    // Re-throw to let main loop handle it
    throw error;
  }
}

/**
 * Get all pet JSON files
 */
async function getPetFiles() {
  const files = await fsPromises.readdir(DATA_DIR);
  return files.filter(file => {
    return file.endsWith('.json') && 
           file !== 'allPets.json' && 
           file !== 'codes.json';
  });
}

/**
 * Format time duration
 */
function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Starting Neopet image download...\n');
  console.log(`📁 Data directory: ${DATA_DIR}`);
  console.log(`📁 Output directory: ${OUTPUT_DIR}`);
  console.log(`⏱️  Rate limit: ${RATE_LIMIT_MS}ms between requests\n`);
  
  // Ensure output directory exists
  await fsPromises.mkdir(OUTPUT_DIR, { recursive: true });
  
  // Get all pet files
  const petFiles = await getPetFiles();
  console.log(`📋 Found ${petFiles.length} pet files to process\n`);
  
  // Process each pet file
  for (let i = 0; i < petFiles.length; i++) {
    const filename = petFiles[i];
    try {
      await processPetFile(filename);
    } catch (error) {
      console.error(`\n⚠️  Error processing pet file ${filename}, continuing to next...`);
      console.error(`   Error: ${error.message}`);
      // Continue to next pet
    }
    
    // Overall progress
    const progress = ((i + 1) / petFiles.length * 100).toFixed(1);
    console.log(`\n📊 Overall progress: ${i + 1}/${petFiles.length} pets (${progress}%)`);
  }
  
  // Print final statistics
  const duration = Date.now() - stats.startTime;
  console.log('\n' + '='.repeat(50));
  console.log('✨ Download complete!');
  console.log('='.repeat(50));
  console.log(`📊 Statistics:`);
  console.log(`   Total images: ${stats.total}`);
  console.log(`   ✅ Downloaded: ${stats.downloaded}`);
  console.log(`   ⏭️  Skipped (already exist): ${stats.skipped}`);
  console.log(`   ❌ Failed: ${stats.failed}`);
  console.log(`   ⏱️  Duration: ${formatDuration(duration)}`);
  console.log(`   📁 Output: ${OUTPUT_DIR}`);
  console.log('='.repeat(50) + '\n');
}

// Run the script
main().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});

