/**
 * Script to generate metadata for SVG icons
 * 
 * This script scans the icons directory recursively, finds all SVG files
 * and generates a metadata JSON file with information about each icon.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const ICONS_DIR = path.join(__dirname, 'icons');
const OUTPUT_FILE = path.join(__dirname, 'icons-metadata.json');
const BASE_URL = process.env.BASE_URL || 'https://my-vercel-app.vercel.app/';

/**
 * Recursively finds all SVG files in a directory
 * @param {string} dir - Directory to scan
 * @param {string} baseDir - Base directory for relative path calculation
 * @returns {Array} Array of objects with file path and relative path
 */
function findSvgFiles(dir, baseDir) {
  let results = [];
  
  // Read directory contents
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    // Skip hidden files/directories
    if (item.startsWith('.')) continue;
    
    const itemPath = path.join(dir, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      // Recursively scan subdirectories
      results = results.concat(findSvgFiles(itemPath, baseDir));
    } else if (path.extname(item).toLowerCase() === '.svg') {
      // Add SVG files to results
      const relativePath = path.relative(baseDir, itemPath);
      results.push({
        filePath: itemPath,
        relativePath: relativePath.replace(/\\/g, '/') // Ensure forward slashes
      });
    }
  }
  
  return results;
}

/**
 * Generates metadata for each SVG file
 * @param {Array} svgFiles - Array of SVG file objects
 * @returns {Array} Array of metadata objects
 */
function generateMetadata(svgFiles) {
  return svgFiles.map(file => {
    // Extract filename without extension
    const id = path.basename(file.relativePath, '.svg');
    
    // Extract category from directory name
    const dirPath = path.dirname(file.relativePath);
    const categories = dirPath === '.' ? [] : [path.basename(dirPath)];
    
    return {
      id,
      name: id, // Same as id for now
      categories,
      tags: [],
      svgUrl: `${BASE_URL}icons/${file.relativePath}`
    };
  });
}

/**
 * Main function to run the script
 */
function main() {
  console.log('Starting icon metadata generation...');
  
  try {
    // Find all SVG files
    console.log(`Scanning directory: ${ICONS_DIR}`);
    const svgFiles = findSvgFiles(ICONS_DIR, path.dirname(ICONS_DIR));
    console.log(`Found ${svgFiles.length} SVG files.`);
    
    // Generate metadata
    const metadata = generateMetadata(svgFiles);
    
    // Prepare output data structure
    const outputData = {
      lastUpdated: new Date().toISOString(),
      totalCount: metadata.length,
      icons: metadata
    };
    
    // Write to file with 2-space indentation
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(outputData, null, 2));
    console.log(`Metadata successfully written to ${OUTPUT_FILE}`);
  } catch (error) {
    console.error('Error generating icon metadata:', error);
    process.exit(1);
  }
}

// Run the script
main(); 