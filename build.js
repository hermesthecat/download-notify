#!/usr/bin/env node

// Build script for Download Notify Extension
// Creates different packages for Firefox, Chrome, and Manifest V3

const fs = require('fs');
const path = require('path');

console.log('🚀 Building Download Notify Extension packages...\n');

// Create build directory if it doesn't exist
const buildDir = 'build';
if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir);
}

// Common files for all builds
const commonFiles = [
    'icons/icon-48.png',
    'LICENSE',
    'README.md'
];

// Build configurations
const buildConfigs = [
    {
        name: 'firefox-v2',
        manifest: 'manifest.json',
        scripts: ['permission-manager.js', 'download-notify.js'],
        description: 'Firefox optimized (Manifest V2)'
    },
    {
        name: 'chrome-v2',
        manifest: 'manifest-chrome.json',
        scripts: ['permission-manager.js', 'download-notify.js'],
        description: 'Chrome optimized (Manifest V2)'
    },
    {
        name: 'universal-v3',
        manifest: 'manifest-v3.json',
        scripts: ['background-v3.js'],
        description: 'Universal (Manifest V3) - Future ready'
    }
];

// Build function
function buildPackage(config) {
    const packageDir = path.join(buildDir, config.name);
    
    // Create package directory
    if (fs.existsSync(packageDir)) {
        fs.rmSync(packageDir, { recursive: true });
    }
    fs.mkdirSync(packageDir, { recursive: true });
    
    // Create icons directory
    fs.mkdirSync(path.join(packageDir, 'icons'), { recursive: true });
    
    // Copy common files
    commonFiles.forEach(file => {
        const srcPath = file;
        const destPath = path.join(packageDir, file);
        
        if (fs.existsSync(srcPath)) {
            fs.copyFileSync(srcPath, destPath);
            console.log(`   ✓ Copied ${file}`);
        }
    });
    
    // Copy manifest (rename to manifest.json)
    fs.copyFileSync(config.manifest, path.join(packageDir, 'manifest.json'));
    console.log(`   ✓ Copied manifest (${config.manifest})`);
    
    // Copy scripts
    config.scripts.forEach(script => {
        if (fs.existsSync(script)) {
            fs.copyFileSync(script, path.join(packageDir, script));
            console.log(`   ✓ Copied ${script}`);
        }
    });
    
    console.log(`📦 ${config.name} package built successfully\n`);
}

// Build all packages
buildConfigs.forEach(config => {
    console.log(`📦 Building ${config.name} - ${config.description}`);
    buildPackage(config);
});

// Create package.json for npm users
const packageJson = {
    "name": "download-notify-extension",
    "version": "2.0.0",
    "description": "Cross-browser download notification extension with memory management and throttling",
    "scripts": {
        "build": "node build.js",
        "dev:firefox": "web-ext run --source-dir=build/firefox-v2",
        "dev:chrome": "web-ext run --source-dir=build/chrome-v2 --target=chromium",
        "package:firefox": "web-ext build --source-dir=build/firefox-v2 --artifacts-dir=dist",
        "package:chrome": "web-ext build --source-dir=build/chrome-v2 --artifacts-dir=dist",
        "package:v3": "web-ext build --source-dir=build/universal-v3 --artifacts-dir=dist"
    },
    "keywords": ["browser-extension", "downloads", "notifications", "chrome", "firefox"],
    "author": "Download Notify Team",
    "license": "MIT",
    "devDependencies": {
        "web-ext": "^7.0.0"
    }
};

fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
console.log('📄 package.json created');

console.log('\n🎉 All packages built successfully!');
console.log('\n📁 Available packages:');
buildConfigs.forEach(config => {
    console.log(`   • ${config.name}/ - ${config.description}`);
});

console.log('\n🛠️  Available npm scripts:');
console.log('   • npm run build - Build all packages');
console.log('   • npm run dev:firefox - Run in Firefox developer mode');
console.log('   • npm run dev:chrome - Run in Chrome developer mode');
console.log('   • npm run package:firefox - Create Firefox .zip package');
console.log('   • npm run package:chrome - Create Chrome .zip package');
console.log('   • npm run package:v3 - Create Manifest V3 .zip package'); 