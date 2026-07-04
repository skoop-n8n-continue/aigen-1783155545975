const fs = require('fs');
let appJs = fs.readFileSync('app.js', 'utf8');

// Fix the map scale and layout for the dragon to be visible correctly
const mapFix = `// Set minimap dragon position based on world coords
    // World is approx 200x200, minimap is 160x160
    const mapScale = 160 / 200;
    minimapDragon.style.left = \`\${(40 * mapScale) + 80}px\`;
    minimapDragon.style.top = \`\${(-(-40) * mapScale) + 80}px\`;`;

const mapFixNew = `// Set minimap dragon position based on world coords
    // World is approx 200x200, minimap is 160x160
    const mapScale = 160 / 200;
    minimapDragon.style.left = \`\${(40 * mapScale) + 80}px\`;
    minimapDragon.style.top = \`\${(-(-40) * mapScale) + 80}px\`;`;

appJs = appJs.replace(mapFix, mapFixNew);

// Update map update code in animate
const updateMap = `                // Update minimap dragon position
                const mapScale = 120 / 200;
                minimapDragon.style.left = \\\`\\\${\\(dragon.position.x \\* mapScale\\) \\+ 60}px\\\`;
                minimapDragon.style.top = \\\`\\\${\\(dragon.position.z \\* mapScale\\) \\+ 60}px\\\`;`;
                
const updateMapNew = `                // Update minimap dragon position
                const mapScale = 160 / 200;
                minimapDragon.style.left = \`\${(dragon.position.x * mapScale) + 80}px\`;
                minimapDragon.style.top = \`\${(dragon.position.z * mapScale) + 80}px\`;`;

appJs = appJs.replace(/const mapScale = 120 \/ 200;\s+minimapDragon\.style\.left = `\$\{\(dragon\.position\.x \* mapScale\) \+ 60\}px`;\s+minimapDragon\.style\.top = `\$\{\(dragon\.position\.z \* mapScale\) \+ 60\}px`;/, updateMapNew);

appJs = appJs.replace(/const mapScale = 120 \/ 200;\s+minimapPlayer\.style\.left = `\$\{\(player\.position\.x \* mapScale\) \+ 60\}px`;\s+minimapPlayer\.style\.top = `\$\{\(player\.position\.z \* mapScale\) \+ 60\}px`;/, `const mapScale = 160 / 200;
        minimapPlayer.style.left = \`\${(player.position.x * mapScale) + 80}px\`;
        minimapPlayer.style.top = \`\${(player.position.z * mapScale) + 80}px\`;`);

fs.writeFileSync('app.js', appJs);
