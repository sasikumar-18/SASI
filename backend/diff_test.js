const fs = require('fs');
const tsCode = fs.readFileSync('../src/app/services/product.service.ts', 'utf8');
const jsCode = fs.readFileSync('seed.js', 'utf8');

const regexMap = [
    'mobileImages', 'accessoryImagesRaw', 'audioImages', 'wearableImages',
    'tabletImages', 'gamingImages', 'laptopImages', 'smartHomeImages',
    'cameraImages', 'twsImages'
];

let mismatch = false;

for (const name of regexMap) {
    const tsMatch = tsCode.match(new RegExp(`(?:const|private readonly)\\s+${name}\\s*=\\s*\\[([\\s\\S]*?)\\]`));
    const jsMatch = jsCode.match(new RegExp(`const ${name}\\s*=\\s*\\[([\\s\\S]*?)\\]`));

    if (!tsMatch) { console.log('TS missing:', name); continue; }
    if (!jsMatch) { console.log('JS missing:', name); continue; }

    const tsContent = tsMatch[1].replace(/\s+/g, '');
    const jsContent = jsMatch[1].replace(/\s+/g, '');

    if (tsContent !== jsContent) {
        console.log(`Mismatch found in array: ${name}`);
        mismatch = true;
    }
}

if (!mismatch) {
    console.log('All image arrays match perfectly between service and seed.');
} else {
    console.log('Arrays do NOT match.');
}
