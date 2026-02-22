const fs = require('fs');
const path = require('path');

const csvPath = 'c:/Users/radhe/Downloads/pawan/OMAP/zlip/normalized_placesDB(in).csv';
const jsonPath = 'c:/Users/radhe/Downloads/pawan/OMAP/zlip/src/data/places.json';

const content = fs.readFileSync(csvPath, 'utf8');
const lines = content.split('\n').filter(l => l.trim() !== '');

function splitCSV(line) {
    const parts = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const next = line[i + 1];
        if (char === '"' && inQuotes && next === '"') {
            current += '"';
            i++; // skip next quote
        } else if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            parts.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    parts.push(current.trim());
    return parts;
}

const places = [];
let currentCategory = '';

for (let i = 1; i < lines.length; i++) {
    const parts = splitCSV(lines[i]);
    if (parts.length < 10) continue;

    if (parts[0]) currentCategory = parts[0];

    const place = {
        category: currentCategory,
        name: parts[1],
        area: parts[2],
        latitude: parseFloat(parts[7]),
        longitude: parseFloat(parts[8]),
        mood_scores: {}
    };

    try {
        if (parts[12]) {
            place.mood_scores = JSON.parse(parts[12]);
        }
    } catch (e) {
        // console.log(`Error parsing JSON at line ${i+1}: ${parts[12]}`);
    }

    if (!isNaN(place.latitude) && !isNaN(place.longitude)) {
        places.push(place);
    }
}

const dataDir = path.dirname(jsonPath);
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

fs.writeFileSync(jsonPath, JSON.stringify(places, null, 2));
console.log(`Converted ${places.length} places to JSON.`);
