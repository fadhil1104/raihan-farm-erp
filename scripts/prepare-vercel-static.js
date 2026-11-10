const fs = require('node:fs/promises');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const source = path.join(root, 'frontend', 'dist');
const destination = path.join(root, 'public');

fs.cp(source, destination, { recursive: true })
  .then(() => console.log('Copied frontend build into Vercel static assets.'))
  .catch((error) => {
    console.error('Could not prepare Vercel static assets:', error);
    process.exitCode = 1;
  });
