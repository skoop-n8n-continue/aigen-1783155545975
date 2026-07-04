const fs = require('fs');

let appJs = fs.readFileSync('app.js', 'utf8');

// Replace createPlayer function
const createPlayerReplacement = `function createPlayer() {
    const color = 0xff66b2; // Pink dress color

    player = new THREE.Group();

    // Body (Dress)
    const bodyGeo = new THREE.ConeGeometry(0.7, 1.5, 16);
    const bodyMat = new THREE.MeshLambertMaterial({ color: color });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.75;
    player.add(body);

    // Head
    const headGeo = new THREE.SphereGeometry(0.4, 16, 16);
    const headMat = new THREE.MeshLambertMaterial({ color: 0xffccaa }); // Skin tone
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 1.9;
    player.add(head);

    // Hair
    const hairGeo = new THREE.SphereGeometry(0.45, 16, 16, 0, Math.PI * 2, 0, Math.PI / 1.5);
    const hairMat = new THREE.MeshLambertMaterial({ color: 0x4a2e15 }); // Brown hair
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.y = 1.95;
    player.add(hair);

    // Arms
    const armGeo = new THREE.CylinderGeometry(0.15, 0.15, 1, 8);
    
    const leftArm = new THREE.Mesh(armGeo, headMat);
    leftArm.position.set(-0.7, 1.2, 0);
    leftArm.rotation.z = Math.PI / 6;
    player.add(leftArm);

    const rightArm = new THREE.Mesh(armGeo, headMat);
    rightArm.position.set(0.7, 1.2, 0);
    rightArm.rotation.z = -Math.PI / 6;
    player.add(rightArm);

    // Legs
    const legGeo = new THREE.CylinderGeometry(0.15, 0.15, 1, 8);
    
    const leftLeg = new THREE.Mesh(legGeo, headMat);
    leftLeg.position.set(-0.3, 0.5, 0);
    player.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, headMat);
    rightLeg.position.set(0.3, 0.5, 0);
    player.add(rightLeg);

    // Start inside house
    player.position.set(0, 0, 2);
    scene.add(player);
}`;

appJs = appJs.replace(/function createPlayer\(\) \{[\s\S]*?scene\.add\(player\);\n\}/, createPlayerReplacement);

// Update Dragon animation to include following/attacking
const animateReplacement = `function animate() {
    if (gameState !== 'playing') return;

    requestAnimationFrame(animate);

    updatePlayer();
    updateBullets();

    // Animate dragon and make it attack
    if (dragon && dragonHealth > 0) {
        dragonTime += 0.05;
        dragon.position.y = Math.sin(dragonTime) * 2;

        // Wing animation
        if (dragon.children.length > 3) {
            dragon.children[2].rotation.z = -0.2 + Math.sin(dragonTime * 2) * 0.4;
            dragon.children[3].rotation.z = 0.2 - Math.sin(dragonTime * 2) * 0.4;
        }

        // Dragon AI - Attack player if close enough
        const distanceToPlayer = dragon.position.distanceTo(player.position);
        if (distanceToPlayer < 40 && hasExitedHouse) {
            // Face the player
            dragon.lookAt(player.position);
            
            // Move towards player
            if (distanceToPlayer > 3) {
                const speed = 0.1;
                const dir = new THREE.Vector3().subVectors(player.position, dragon.position).normalize();
                dragon.position.addScaledVector(dir, speed);
                
                // Update minimap dragon position
                const mapScale = 120 / 200;
                minimapDragon.style.left = \`\${(dragon.position.x * mapScale) + 60}px\`;
                minimapDragon.style.top = \`\${(dragon.position.z * mapScale) + 60}px\`;
            } else {
                // Attack range! (Game over if caught)
                endGame();
            }
        } else {
           // Idle rotation when far away
           dragon.rotation.y = -Math.PI / 4 + Math.sin(dragonTime * 0.5) * 0.5; 
        }
    }

    renderer.render(scene, camera);
}`;

appJs = appJs.replace(/function animate\(\) \{[\s\S]*?renderer\.render\(scene, camera\);\n\}/, animateReplacement);

// Update Dragon colors to original (they were overwritten by mistake in previous fix-dragon.js? Let's make sure it's green)
appJs = appJs.replace(/0xaa0000/g, '0x228B22');

fs.writeFileSync('app.js', appJs);
