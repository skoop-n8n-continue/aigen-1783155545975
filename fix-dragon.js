const fs = require('fs');

let appJs = fs.readFileSync('app.js', 'utf8');

const oldDragon = `function createDragon() {
    dragon = new THREE.Group();

    const bodyGeo = new THREE.BoxGeometry(4, 3, 6);
    const bodyMat = new THREE.MeshLambertMaterial({ color: 0xaa0000 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 2;

    const headGeo = new THREE.BoxGeometry(2, 2, 3);
    const head = new THREE.Mesh(headGeo, bodyMat);
    head.position.set(0, 4, 4);

    dragon.add(body);
    dragon.add(head);

    dragon.position.set(40, 0, -40);
    scene.add(dragon);

    // Set minimap dragon position based on world coords
    // World is approx 200x200, minimap is 120x120
    const mapScale = 120 / 200;
    minimapDragon.style.left = \`\${(40 * mapScale) + 60}px\`;
    minimapDragon.style.top = \`\${(-(-40) * mapScale) + 60}px\`;
}`;

const newDragon = `function createDragon() {
    dragon = new THREE.Group();

    const bodyMat = new THREE.MeshLambertMaterial({ color: 0x228B22 }); // Green dragon
    const accentMat = new THREE.MeshLambertMaterial({ color: 0x006400 }); // Dark green spikes

    // Body
    const bodyGeo = new THREE.BoxGeometry(4, 4, 8);
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 4;
    
    // Head
    const headGeo = new THREE.BoxGeometry(3, 3, 4);
    const head = new THREE.Mesh(headGeo, bodyMat);
    head.position.set(0, 6, 5);

    // Snout
    const snoutGeo = new THREE.BoxGeometry(2, 1.5, 3);
    const snout = new THREE.Mesh(snoutGeo, bodyMat);
    snout.position.set(0, -0.5, 3.5);
    head.add(snout);

    // Eyes
    const eyeGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-1, 0.5, 1.5);
    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(1, 0.5, 1.5);
    head.add(leftEye);
    head.add(rightEye);

    // Wings
    const wingGeo = new THREE.BoxGeometry(8, 0.5, 6);
    const leftWing = new THREE.Mesh(wingGeo, accentMat);
    leftWing.position.set(-5, 5, 0);
    leftWing.rotation.z = -0.2;
    const rightWing = new THREE.Mesh(wingGeo, accentMat);
    rightWing.position.set(5, 5, 0);
    rightWing.rotation.z = 0.2;

    // Tail
    const tailGeo = new THREE.BoxGeometry(1.5, 1.5, 6);
    const tail = new THREE.Mesh(tailGeo, bodyMat);
    tail.position.set(0, 3, -6);
    tail.rotation.x = -0.2;

    dragon.add(body);
    dragon.add(head);
    dragon.add(leftWing);
    dragon.add(rightWing);
    dragon.add(tail);

    dragon.position.set(40, 0, -40);
    // Face the house
    dragon.rotation.y = -Math.PI / 4; 
    scene.add(dragon);

    // Set minimap dragon position based on world coords
    // World is approx 200x200, minimap is 120x120
    const mapScale = 120 / 200;
    minimapDragon.style.left = \`\${(40 * mapScale) + 60}px\`;
    minimapDragon.style.top = \`\${(-(-40) * mapScale) + 60}px\`;
}`;

appJs = appJs.replace(oldDragon, newDragon);
fs.writeFileSync('app.js', appJs);

console.log('Dragon updated');
