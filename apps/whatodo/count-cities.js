const fs = require('fs');
const text = fs.readFileSync('src/data/collected-places.ts', 'utf8');
const cities = {};
let m;
const regex = /city:\s*"(\w+)"/g;
while ((m = regex.exec(text)) !== null) {
  const c = m[1];
  cities[c] = (cities[c] || 0) + 1;
}
console.log(JSON.stringify(cities, null, 2));
