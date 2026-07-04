const fs = require('fs');
let appJs = fs.readFileSync('app.js', 'utf8');

appJs = appJs.replace(/\/\/ Wing animation\s+if \(dragon\.children\.length > 3\) \{\s+dragon\.children\[2\]\.rotation\.z = -0\.2 \+ Math\.sin\(dragonTime \* 2\) \* 0\.4;\s+dragon\.children\[3\]\.rotation\.z = 0\.2 - Math\.sin\(dragonTime \* 2\) \* 0\.4;\s+\}/g, `// Wing animation
        if (dragon.children.length > 5) {
            // Children[3] and [4] are the wings in the new model
            dragon.children[3].rotation.y = -Math.PI / 6 + Math.sin(dragonTime * 3) * 0.5;
            dragon.children[4].rotation.y = Math.PI / 6 - Math.sin(dragonTime * 3) * 0.5;
            
            // Tail wag
            if(dragon.children[5]) {
                dragon.children[5].rotation.z = Math.sin(dragonTime * 1.5) * 0.2;
            }
            // Head bob
            if(dragon.children[2]) {
                dragon.children[2].rotation.x = Math.sin(dragonTime) * 0.1;
            }
        }`);

fs.writeFileSync('app.js', appJs);
