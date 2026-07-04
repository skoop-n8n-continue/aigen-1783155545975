const fs = require('fs');
console.log(fs.readFileSync('app.js', 'utf8').includes('function createDragon'));
