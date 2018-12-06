const fs = require('fs');
const pkg = require('../package.json');
const manifest = require('../src/manifest.json');

console.log('src/manifest.json', 'from', manifest.version, 'to', pkg.version);

manifest.version = pkg.version;

fs.writeFileSync('src/manifest.json', JSON.stringify(manifest, null, 2));
