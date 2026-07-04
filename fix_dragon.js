const fs = require('fs');

let appJs = fs.readFileSync('app.js', 'utf8');

// Replace the simple createDragon with a GLTF loader attempt if possible, or just build a more complex one using Three.js primitives
appJs = appJs.replace(/function createDragon\(\) \{[\s\S]*?minimapDragon\.style\.top = `\$\{.*?\}\`;\n\}/g, `function createDragon() {
    dragon = new THREE.Group();

    // Dark scales color
    const bodyMat = new THREE.MeshStandardMaterial({ 
        color: 0x113311,
        roughness: 0.8,
        metalness: 0.2
    }); 
    const bellyMat = new THREE.MeshStandardMaterial({ color: 0x33aa33, roughness: 0.9 });
    const hornMat = new THREE.MeshStandardMaterial({ color: 0xddddaa, roughness: 0.5 });
    const wingMat = new THREE.MeshStandardMaterial({ 
        color: 0x0a1a0a,
        side: THREE.DoubleSide
    });

    // Body (longer, sleeker)
    const bodyGeo = new THREE.CylinderGeometry(2, 3, 12, 8);
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.rotation.x = Math.PI / 2;
    body.position.set(0, 4, 0);
    dragon.add(body);
    
    // Neck
    const neckGeo = new THREE.CylinderGeometry(1, 2, 6, 8);
    const neck = new THREE.Mesh(neckGeo, bodyMat);
    neck.rotation.x = Math.PI / 3;
    neck.position.set(0, 7, 6);
    dragon.add(neck);

    // Head
    const headGrp = new THREE.Group();
    headGrp.position.set(0, 9, 8);
    
    const headGeo = new THREE.BoxGeometry(2.5, 3, 4);
    const head = new THREE.Mesh(headGeo, bodyMat);
    headGrp.add(head);

    // Snout (longer)
    const snoutGeo = new THREE.BoxGeometry(2, 1.5, 4);
    const snout = new THREE.Mesh(snoutGeo, bodyMat);
    snout.position.set(0, -0.5, 3.5);
    headGrp.add(snout);

    // Horns
    const hornGeo = new THREE.ConeGeometry(0.4, 3, 4);
    const leftHorn = new THREE.Mesh(hornGeo, hornMat);
    leftHorn.position.set(-1, 2, -1);
    leftHorn.rotation.x = -Math.PI / 4;
    leftHorn.rotation.z = Math.PI / 8;
    const rightHorn = new THREE.Mesh(hornGeo, hornMat);
    rightHorn.position.set(1, 2, -1);
    rightHorn.rotation.x = -Math.PI / 4;
    rightHorn.rotation.z = -Math.PI / 8;
    headGrp.add(leftHorn);
    headGrp.add(rightHorn);

    // Eyes
    const eyeGeo = new THREE.SphereGeometry(0.4, 8, 8);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-1.1, 0.5, 1.5);
    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(1.1, 0.5, 1.5);
    
    // Glowing pupil
    const pupilGeo = new THREE.SphereGeometry(0.2, 8, 8);
    const pupilMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const leftPupil = new THREE.Mesh(pupilGeo, pupilMat);
    leftPupil.position.set(-0.1, 0, 0.3);
    leftEye.add(leftPupil);
    const rightPupil = new THREE.Mesh(pupilGeo, pupilMat);
    rightPupil.position.set(0.1, 0, 0.3);
    rightEye.add(rightPupil);
    
    headGrp.add(leftEye);
    headGrp.add(rightEye);
    
    dragon.add(headGrp);

    // Wings (Larger, more realistic shape)
    const wingGeo = new THREE.PlaneGeometry(12, 10);
    const leftWing = new THREE.Mesh(wingGeo, wingMat);
    leftWing.position.set(-6, 6, 0);
    leftWing.rotation.x = -Math.PI / 2;
    leftWing.rotation.y = -Math.PI / 6;
    
    const rightWing = new THREE.Mesh(wingGeo, wingMat);
    rightWing.position.set(6, 6, 0);
    rightWing.rotation.x = -Math.PI / 2;
    rightWing.rotation.y = Math.PI / 6;

    dragon.add(leftWing);
    dragon.add(rightWing);

    // Tail
    const tailGeo = new THREE.CylinderGeometry(0.2, 2, 10, 8);
    const tail = new THREE.Mesh(tailGeo, bodyMat);
    tail.position.set(0, 3, -10);
    tail.rotation.x = -Math.PI / 2;
    dragon.add(tail);
    
    // Spikes along back
    const spikeGeo = new THREE.ConeGeometry(0.5, 2, 4);
    for(let i=0; i<5; i++) {
        const spike = new THREE.Mesh(spikeGeo, hornMat);
        spike.position.set(0, 6, -4 + (i*3));
        dragon.add(spike);
    }

    dragon.position.set(50, 0, -50);
    // Face the house
    dragon.rotation.y = -Math.PI / 4; 
    scene.add(dragon);

    // Set minimap dragon position based on world coords
    // World is approx 200x200, minimap is 160x160 (scale is 160/200)
    const mapScale = 160 / 200;
    minimapDragon.style.left = \`\${(50 * mapScale) + 80}px\`;
    minimapDragon.style.top = \`\${(-(-50) * mapScale) + 80}px\`;
}`);

fs.writeFileSync('app.js', appJs);
