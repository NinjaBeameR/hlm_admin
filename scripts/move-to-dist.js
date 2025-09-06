import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync, rmSync } from 'fs';
import { join } from 'path';

// Script to move build/ contents to dist/
function moveToDistFolder() {
  const buildSrc = 'build';
  const distDest = 'dist';
  
  // Clean dist folder if it exists
  if (existsSync(distDest)) {
    rmSync(distDest, { recursive: true, force: true });
  }
  
  // Create dist folder
  mkdirSync(distDest, { recursive: true });
  
  if (existsSync(buildSrc)) {
    const copyRecursive = (src, dest) => {
      if (!existsSync(dest)) {
        mkdirSync(dest, { recursive: true });
      }
      
      const entries = readdirSync(src);
      for (const entry of entries) {
        const srcPath = join(src, entry);
        const destPath = join(dest, entry);
        
        if (statSync(srcPath).isDirectory()) {
          copyRecursive(srcPath, destPath);
        } else {
          copyFileSync(srcPath, destPath);
        }
      }
    };
    
    copyRecursive(buildSrc, distDest);
    console.log('✓ Moved admin build from build/ to dist/');
    
    // Clean up build folder
    rmSync(buildSrc, { recursive: true, force: true });
  } else {
    console.error('❌ Build folder not found');
    process.exit(1);
  }
}

moveToDistFolder();
