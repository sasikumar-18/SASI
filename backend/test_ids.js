const fs = require('fs');
const jsCode = fs.readFileSync('seed.js', 'utf8');

const regexMap = [
    'mobileImages', 'accessoryImagesRaw', 'audioImages', 'wearableImages',
    'tabletImages', 'gamingImages', 'laptopImages', 'smartHomeImages',
    'cameraImages', 'twsImages'
];

for (const name of regexMap) {
    const jsMatch = jsCode.match(new RegExp(`const ${name}\\s*=\\s*\\[([\\s\\S]*?)\\]`));
    if (jsMatch) {
        const arr = jsMatch[1].split(',').map(s => s.trim().replace(/'/g, '').replace(/\n/g, ''));
        arr.forEach(id => {
            // Check for valid format: generally a 10-13 digit number followed by a dash and an alphanumeric hash
            if (!/^\d{10,13}-[a-f0-9]{8,}$/.test(id)) {
                console.log(`Potential bad ID in ${name}: ${id}`);
            }
        });
    }
}
