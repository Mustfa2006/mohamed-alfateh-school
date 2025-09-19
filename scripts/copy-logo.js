// Copies the root logo file into /public for favicons/OG/manifest
// This avoids binary editing in the repo and works on Netlify at build time.
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const src = path.join(root, 'photo_٢٠٢٥-٠٩-١٩_١٧-٣٨-٣٠.jpg');
const pub = path.join(root, 'public');
const appDir = path.join(root, 'src', 'app');

function safeCopy(from, to) {
  try {
    fs.copyFileSync(from, to);
    console.log('Copied:', path.relative(root, to));
  } catch (e) {
    console.warn('Skip copy (missing?):', path.relative(root, from));
  }
}

try {
  if (!fs.existsSync(pub)) fs.mkdirSync(pub, { recursive: true });
  if (!fs.existsSync(appDir)) fs.mkdirSync(appDir, { recursive: true });
  if (fs.existsSync(src)) {
    // Public assets
    safeCopy(src, path.join(pub, 'school-logo.jpg'));
    safeCopy(src, path.join(pub, 'icon-192.jpg'));
    safeCopy(src, path.join(pub, 'icon-512.jpg'));
    // App Router special files for icons/OG/Twitter
    safeCopy(src, path.join(appDir, 'icon.jpg'));
    safeCopy(src, path.join(appDir, 'apple-icon.jpg'));
    safeCopy(src, path.join(appDir, 'opengraph-image.jpg'));
    safeCopy(src, path.join(appDir, 'twitter-image.jpg'));
  } else {
    console.warn('Logo source not found at', src);
  }
} catch (err) {
  console.error('Error preparing logo files:', err);
  // Do not fail the build because of missing logo
}

