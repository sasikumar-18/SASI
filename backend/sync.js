const fs = require('fs');
const tsCode = fs.readFileSync('../src/app/services/product.service.ts', 'utf8');
let jsCode = fs.readFileSync('seed.js', 'utf8');

const regexMap = [
    'mobileImages', 'accessoryImagesRaw', 'audioImages', 'wearableImages',
    'tabletImages', 'gamingImages', 'laptopImages', 'smartHomeImages',
    'cameraImages', 'twsImages'
];

for (const name of regexMap) {
    const tsMatch = tsCode.match(new RegExp(`(?:const|private readonly)\\s+${name}\\s*=\\s*\\[([\\s\\S]*?)\\]`));
    if (tsMatch) {
        const tsArrayContents = tsMatch[1];
        jsCode = jsCode.replace(
            new RegExp(`const ${name}\\s*=\\s*\\[([\\s\\S]*?)\\]`),
            `const ${name} = [\n${tsArrayContents}\n]`
        );
    }
}

fs.writeFileSync('seed.js', jsCode);
console.log('Synchronized seed.js with arrays from product.service.ts');
