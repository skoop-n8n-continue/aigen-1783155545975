const fs = require('fs');

let css = fs.readFileSync('style.css', 'utf8');

const oldMap = `/* Minimap */
#minimap-container {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 120px;
    height: 120px;
    background-color: rgba(16, 24, 31, 0.7);
    border: 2px solid #00b7af;
    border-radius: 10px;
    z-index: 20;
    transition: opacity 0.5s;
}

#minimap-container.hidden {
    opacity: 0;
    pointer-events: none;
}

#minimap-player {
    position: absolute;
    width: 6px;
    height: 6px;
    background-color: #00b7af;
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

#minimap-dragon {
    position: absolute;
    width: 8px;
    height: 8px;
    background-color: #ff0000;
    border-radius: 50%;
}`;

const newMap = `/* Minimap */
#minimap-container {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 160px;
    height: 160px;
    background-color: rgba(16, 24, 31, 0.85);
    border: 3px solid #00b7af;
    border-radius: 50%; /* Make it circular like a radar */
    z-index: 20;
    transition: opacity 0.5s;
    box-shadow: 0 0 15px rgba(0, 183, 175, 0.5);
    overflow: hidden;
}

/* Radar lines */
#minimap-container::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: rgba(0, 183, 175, 0.3);
}

#minimap-container::after {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    width: 1px;
    height: 100%;
    background-color: rgba(0, 183, 175, 0.3);
}

#minimap-container.hidden {
    opacity: 0;
    pointer-events: none;
}

#minimap-player {
    position: absolute;
    width: 10px;
    height: 10px;
    background-color: #00ffcc;
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 8px #00ffcc;
    z-index: 5;
}

/* Player direction indicator on minimap */
#minimap-player::after {
    content: '';
    position: absolute;
    top: -5px;
    left: 50%;
    transform: translateX(-50%);
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 5px solid #00ffcc;
}

#minimap-dragon {
    position: absolute;
    width: 14px;
    height: 14px;
    background-color: #ff3333;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 10px #ff3333;
    animation: pulse 1s infinite alternate;
}

/* Add labels to minimap */
.minimap-label {
    position: absolute;
    font-size: 10px;
    color: white;
    font-weight: bold;
    text-shadow: 1px 1px 2px black;
}
#label-house { top: 50%; left: 50%; transform: translate(-50%, -50%); }

@keyframes pulse {
    from { transform: translate(-50%, -50%) scale(1); }
    to { transform: translate(-50%, -50%) scale(1.3); }
}`;

css = css.replace(oldMap, newMap);
fs.writeFileSync('style.css', css);

let app = fs.readFileSync('app.js', 'utf8');

// Update minimap scale and position
app = app.replace(
    /const mapScale = 120 \/ 200;\n    minimapDragon\.style\.left = `\$\{\(40 \* mapScale\) \+ 60\}px`;\n    minimapDragon\.style\.top = `\$\{\(-\(-40\) \* mapScale\) \+ 60\}px`;/,
    `const mapScale = 160 / 200;\n    minimapDragon.style.left = \`\${(40 * mapScale) + 80}px\`;\n    minimapDragon.style.top = \`\${(-(-40) * mapScale) + 80}px\`;`
);

// Add house label to index.html if we want, or just update player minimap position dynamically
const oldMapUpdate = `    // Update minimap player
    const mapScale = 120 / 200;
    minimapPlayer.style.left = \`\${(player.position.x * mapScale) + 60}px\`;
    minimapPlayer.style.top = \`\${(-player.position.z * mapScale) + 60}px\`;`;

const newMapUpdate = `    // Update minimap player (160px size / 200 units = 0.8 scale, center is 80px)
    const mapScale = 160 / 200;
    minimapPlayer.style.left = \`\${(player.position.x * mapScale) + 80}px\`;
    minimapPlayer.style.top = \`\${(player.position.z * mapScale) + 80}px\`;
    
    // Rotate player marker on minimap based on facing direction
    minimapPlayer.style.transform = \`translate(-50%, -50%) rotate(\${-player.rotation.y}rad)\`;`;

app = app.replace(oldMapUpdate, newMapUpdate);

fs.writeFileSync('app.js', app);
console.log('Minimap updated');
