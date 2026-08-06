const fs = require('fs');
const path = require('path');
const viContent = fs.readFileSync('./src/locales/vi.js', 'utf8');

// A simple parser since vi.js is an ES module
// We'll just extract the object string and eval it
const objStr = viContent.substring(viContent.indexOf('{'));
let vi = {};
try {
  // Use Function to evaluate the object
  vi = new Function('return ' + objStr)();
} catch(e) {
  console.log("Error parsing vi.js", e);
}

const keys = new Set();
const missingKeys = new Set();

function flattenObj(obj, prefix = '') {
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object' && value !== null) {
      flattenObj(value, prefix + key + '.');
    } else {
      keys.add(prefix + key);
    }
  }
}
flattenObj(vi);

function findMatches(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      findMatches(fullPath);
    } else if (fullPath.endsWith('.vue')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const regex = /\$t\(['"]([^'"]+)['"]\)/g;
      const regex2 = /\W+t\(['"]([^'"]+)['"]\)/g;
      let match;
      while ((match = regex.exec(content)) !== null) {
        if (!keys.has(match[1])) missingKeys.add(match[1]);
      }
      while ((match = regex2.exec(content)) !== null) {
        // filter out things like Object.keys, etc. Just simplistic check
        if (!keys.has(match[1])) missingKeys.add(match[1]);
      }
    }
  }
}

findMatches(path.join(__dirname, 'src'));
console.log('Missing keys:');
missingKeys.forEach(k => console.log(k));
