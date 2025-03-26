/**
 * Script to generate metadata for SVG icons
 * 
 * This script scans the assets/icons directory recursively, finds all SVG files
 * and generates a metadata JSON file with information about each icon.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const ICONS_DIR = path.join(__dirname, '..', 'assets', 'icons');
const OUTPUT_FILE = path.join(__dirname, '..', 'assets', 'icons-metadata.json');

// UWAGA: Zawsze używaj HTTPS!
// Figma wymaga, aby wszystkie zewnętrzne zasoby były ładowane przez HTTPS.
// Korzystanie z HTTP spowoduje błędy "Mixed Content" w konsoli Figma.
const BASE_URL = process.env.BASE_URL || 'https://figma-plugin-indol.vercel.app/';

// Upewnij się, że BASE_URL zawsze używa HTTPS
if (!BASE_URL.startsWith('https://')) {
  console.warn('⚠️ UWAGA: BASE_URL powinien używać protokołu HTTPS dla zgodności z Figma!');
  console.warn('   Wszystkie URLe do ikon będą prefixowane "https://" zamiast "http://"');
}

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
    
    // Zapewnij, że URL zawsze używa HTTPS
    let svgUrl = `${BASE_URL}icons/${file.relativePath}`;
    if (svgUrl.startsWith('http://')) {
      svgUrl = svgUrl.replace('http://', 'https://');
      console.log(`Zmieniono URL ikony ${id} na HTTPS: ${svgUrl}`);
    }
    
    // Sprawdź, czy ścieżka nie zawiera podwójnego segmentu 'icons'
    if (svgUrl.includes('/icons/icons/')) {
      const originalUrl = svgUrl;
      svgUrl = svgUrl.replace('/icons/icons/', '/icons/');
      console.log(`Poprawiono URL z podwójnym segmentem 'icons' dla ikony ${id}:
      - Przed: ${originalUrl}
      - Po: ${svgUrl}`);
    }
    
    // Sprawdź, czy URL kończy się na .svg 
    if (!svgUrl.endsWith('.svg')) {
      console.warn(`⚠️ UWAGA: URL dla ikony ${id} nie kończy się na .svg: ${svgUrl}`);
    }
    
    // Sprawdź, czy używamy poprawnego protokołu
    if (!svgUrl.startsWith('https://')) {
      console.warn(`⚠️ UWAGA: URL dla ikony ${id} nie używa HTTPS: ${svgUrl}`);
    }
    
    console.log(`✅ Wygenerowano URL dla ikony ${id}: ${svgUrl}`);
    
    return {
      id,
      name: id, // Same as id for now
      categories,
      tags: [],
      svgUrl
    };
  });
}

/**
 * Main function to run the script
 */
function main() {
  console.log('Starting icon metadata generation...');
  
  try {
    // Verify that directory exists
    if (!fs.existsSync(ICONS_DIR)) {
      console.error(`Error: Directory ${ICONS_DIR} does not exist.`);
      console.log('Make sure you are running the script from the correct location.');
      process.exit(1);
    }
    
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
    
    // Create output directory if it doesn't exist
    const outputDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Write to file with 2-space indentation
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(outputData, null, 2));
    console.log(`Metadata successfully written to ${OUTPUT_FILE}`);
    console.log(`Generated ${metadata.length} icon entries.`);
    console.log(`Last updated: ${outputData.lastUpdated}`);
    console.log('\nRemember to deploy your assets folder to Vercel for the plugin to access the latest icons!');
  } catch (error) {
    console.error('Error generating icon metadata:', error);
    process.exit(1);
  }
}

// Run the script
main(); 