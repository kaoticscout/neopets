#!/usr/bin/env node

/**
 * Quick script to check download progress
 */

const fs = require('fs').promises;
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '..', 'data', 'neopets', 'art');
const DATA_DIR = path.join(__dirname, '..', 'data');

async function checkProgress() {
  try {
    // Get all pet JSON files
    const files = await fs.readdir(DATA_DIR);
    const petFiles = files.filter(file => 
      file.endsWith('.json') && 
      file !== 'allPets.json' && 
      file !== 'codes.json'
    );
    
    console.log('📊 Download Progress Report\n');
    console.log('='.repeat(60));
    
    let totalPets = petFiles.length;
    let completePets = 0;
    let partialPets = 0;
    let notStartedPets = 0;
    
    let totalExpected = 0;
    let totalDownloaded = 0;
    
    for (const petFile of petFiles) {
      const petName = path.basename(petFile, '.json');
      const petDir = path.join(OUTPUT_DIR, petName);
      
      try {
        // Check if pet directory exists
        await fs.access(petDir);
        
        // Count files
        const femaleDir = path.join(petDir, 'female');
        const maleDir = path.join(petDir, 'male');
        
        let femaleCount = 0;
        let maleCount = 0;
        
        try {
          const femaleFiles = await fs.readdir(femaleDir);
          femaleCount = femaleFiles.filter(f => f.endsWith('.png')).length;
        } catch {}
        
        try {
          const maleFiles = await fs.readdir(maleDir);
          maleCount = maleFiles.filter(f => f.endsWith('.png')).length;
        } catch {}
        
        // Read JSON to get expected count
        const petData = JSON.parse(await fs.readFile(path.join(DATA_DIR, petFile), 'utf-8'));
        const colors = Object.entries(petData);
        let expectedFemale = 0;
        let expectedMale = 0;
        
        for (const [_, colorData] of colors) {
          if (colorData.female) expectedFemale++;
          if (colorData.male) expectedMale++;
        }
        
        totalExpected += expectedFemale + expectedMale;
        totalDownloaded += femaleCount + maleCount;
        
        const femalePercent = expectedFemale > 0 ? (femaleCount / expectedFemale * 100).toFixed(1) : 100;
        const malePercent = expectedMale > 0 ? (maleCount / expectedMale * 100).toFixed(1) : 100;
        const totalPercent = (expectedFemale + expectedMale) > 0 
          ? ((femaleCount + maleCount) / (expectedFemale + expectedMale) * 100).toFixed(1)
          : 100;
        
        if (totalPercent === '100.0') {
          completePets++;
          console.log(`✅ ${petName.padEnd(15)} ${(femaleCount + maleCount).toString().padStart(4)}/${expectedFemale + expectedMale} (100%)`);
        } else if (femaleCount > 0 || maleCount > 0) {
          partialPets++;
          console.log(`🔄 ${petName.padEnd(15)} ${(femaleCount + maleCount).toString().padStart(4)}/${expectedFemale + expectedMale} (${totalPercent}%) - F:${femaleCount}/${expectedFemale} M:${maleCount}/${expectedMale}`);
        } else {
          notStartedPets++;
          console.log(`⏳ ${petName.padEnd(15)} Not started`);
        }
        
      } catch {
        // Pet directory doesn't exist
        notStartedPets++;
        console.log(`⏳ ${petName.padEnd(15)} Not started`);
      }
    }
    
    console.log('='.repeat(60));
    console.log(`\n📈 Summary:`);
    console.log(`   Total pets: ${totalPets}`);
    console.log(`   ✅ Complete: ${completePets}`);
    console.log(`   🔄 In progress: ${partialPets}`);
    console.log(`   ⏳ Not started: ${notStartedPets}`);
    console.log(`\n📦 Images:`);
    console.log(`   Downloaded: ${totalDownloaded.toLocaleString()}`);
    console.log(`   Expected: ${totalExpected.toLocaleString()}`);
    const overallPercent = totalExpected > 0 ? (totalDownloaded / totalExpected * 100).toFixed(2) : 0;
    console.log(`   Progress: ${overallPercent}%`);
    
    // Check for recent activity (last 5 minutes)
    console.log(`\n🕐 Recent Activity (checking for new files in last 5 minutes)...`);
    try {
      const allDirs = await fs.readdir(OUTPUT_DIR);
      let recentCount = 0;
      const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
      
      for (const petDir of allDirs) {
        try {
          const petPath = path.join(OUTPUT_DIR, petDir);
          const stat = await fs.stat(petPath);
          if (stat.mtimeMs > fiveMinutesAgo) {
            recentCount++;
          }
          
          // Check subdirectories
          const subdirs = ['female', 'male'];
          for (const subdir of subdirs) {
            try {
              const subdirPath = path.join(petPath, subdir);
              const files = await fs.readdir(subdirPath);
              for (const file of files) {
                if (file.endsWith('.png')) {
                  const filePath = path.join(subdirPath, file);
                  const fileStat = await fs.stat(filePath);
                  if (fileStat.mtimeMs > fiveMinutesAgo) {
                    recentCount++;
                    console.log(`   ✨ ${petDir}/${subdir}/${file} (${Math.round((Date.now() - fileStat.mtimeMs) / 1000)}s ago)`);
                  }
                }
              }
            } catch {}
          }
        } catch {}
      }
      
      if (recentCount === 0) {
        console.log(`   ⚠️  No files modified in the last 5 minutes`);
        console.log(`   💡 The script might be paused, waiting, or completed`);
      }
    } catch (error) {
      console.log(`   Could not check recent activity: ${error.message}`);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkProgress();

