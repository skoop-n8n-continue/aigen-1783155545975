// Game State
let gameState = 'home'; // home, playing, gameover
let selectedCharacter = null; // 'boy' or 'girl'
let dragonHealth = 3;
let hasExitedHouse = false;

// DOM Elements
const homeScreen = document.getElementById('home-screen');
const gameUI = document.getElementById('game-ui');
const gameOverScreen = document.getElementById('game-over-screen');
const startBtn = document.getElementById('start-btn');
const charGirl = document.getElementById('char-girl');
const minimap = document.getElementById('minimap-container');
const minimapPlayer = document.getElementById('minimap-player');
const minimapDragon = document.getElementById('minimap-dragon');

// Three.js variables
let scene, camera, renderer;
let player, dragon, house;
let bullets = [];
let keys = { forward: false, backward: false, left: false, right: false };
let isJumping = false;
let jumpVelocity = 0;
const gravity = 0.01;
const moveSpeed = 0.2;

// Initialize Character Selection
const selectGirl = (e) => {
    if(e && e.type === 'touchstart') e.preventDefault();
    selectedCharacter = 'girl';
    charGirl.classList.add('selected');
    startGame();
};
charGirl.addEventListener('click', selectGirl);
charGirl.addEventListener('touchstart', selectGirl);
charGirl.addEventListener('pointerdown', selectGirl);

// Start Game
startBtn.addEventListener('click', startGame);
startBtn.addEventListener('touchstart', (e) => { e.preventDefault(); startGame(); });
startBtn.addEventListener('pointerdown', (e) => { e.preventDefault(); startGame(); });

function startGame() {
    homeScreen.classList.remove('active');
    gameUI.classList.add('active');
    gameState = 'playing';
    dragonHealth = 3;
    hasExitedHouse = false;
    minimap.classList.add('hidden');

    initThreeJS();
}

// Three.js Setup
function initThreeJS() {
    const canvas = document.getElementById('game-canvas');

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050510); // Night sky

    // Night lighting
    const ambientLight = new THREE.AmbientLight(0x202040, 1.5);
    scene.add(ambientLight);

    const moonLight = new THREE.DirectionalLight(0xaaccff, 0.8);
    moonLight.position.set(50, 100, -50);
    scene.add(moonLight);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Ground
    const groundGeo = new THREE.PlaneGeometry(200, 200);
    const groundMat = new THREE.MeshLambertMaterial({ color: 0x113311 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    createEnvironment();
    createPlayer();
    createDragon();

    camera.position.set(0, 5, 10);
    camera.lookAt(player.position);

    // Setup controls
    setupControls();

    // Start animation loop
    requestAnimationFrame(animate);
}

function createEnvironment() {
    // House
    const houseGrp = new THREE.Group();

    // Walls
    const wallMat = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const wallGeo = new THREE.BoxGeometry(10, 6, 10);
    const walls = new THREE.Mesh(wallGeo, wallMat);
    walls.position.y = 3;

    // Roof
    const roofMat = new THREE.MeshLambertMaterial({ color: 0x5c2c16 });
    const roofGeo = new THREE.ConeGeometry(8, 4, 4);
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.y = 8;
    roof.rotation.y = Math.PI / 4;

    // Door (open)
    const doorGeo = new THREE.BoxGeometry(2, 4, 0.1);
    const doorMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const door = new THREE.Mesh(doorGeo, doorMat);
    door.position.set(0, 2, 5);

    houseGrp.add(walls);
    houseGrp.add(roof);
    houseGrp.add(door);

    houseGrp.position.set(0, 0, 0);
    scene.add(houseGrp);
    house = houseGrp;

    // Trees
    for(let i=0; i<30; i++) {
        createTree(
            (Math.random() - 0.5) * 150,
            (Math.random() - 0.5) * 150
        );
    }
}

function createTree(x, z) {
    // Don't place trees in/near house or dragon area
    if (Math.abs(x) < 15 && Math.abs(z) < 15) return;
    if (Math.abs(x - 40) < 20 && Math.abs(z + 40) < 20) return;

    const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.5, 0.5, 4),
        new THREE.MeshLambertMaterial({ color: 0x4a2e15 })
    );
    trunk.position.set(x, 2, z);

    const leaves = new THREE.Mesh(
        new THREE.ConeGeometry(3, 6, 5),
        new THREE.MeshLambertMaterial({ color: 0x0f4a15 })
    );
    leaves.position.set(x, 6, z);

    scene.add(trunk);
    scene.add(leaves);
}

function createPlayer() {
    const color = selectedCharacter === 'boy' ? 0x3a86ff : 0xff006e;

    const bodyGeo = new THREE.CylinderGeometry(0.5, 0.5, 2);
    const bodyMat = new THREE.MeshLambertMaterial({ color: color });
    player = new THREE.Mesh(bodyGeo, bodyMat);

    const headGeo = new THREE.SphereGeometry(0.6);
    const headMat = new THREE.MeshLambertMaterial({ color: 0xffccaa });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 1.5;
    player.add(head);

    // Start inside house
    player.position.set(0, 1, 2);
    scene.add(player);
}

function createDragon() {
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
}

function setupControls() {
    // Touch / Mouse controls for D-Pad
    const setupBtn = (id, key) => {
        const btn = document.getElementById(id);
        btn.addEventListener('mousedown', () => keys[key] = true);
        btn.addEventListener('mouseup', () => keys[key] = false);
        btn.addEventListener('mouseleave', () => keys[key] = false);
        btn.addEventListener('touchstart', (e) => { e.preventDefault(); keys[key] = true; });
        btn.addEventListener('touchend', (e) => { e.preventDefault(); keys[key] = false; });
    };

    setupBtn('btn-forward', 'forward');
    setupBtn('btn-backward', 'backward');
    setupBtn('btn-left', 'left');
    setupBtn('btn-right', 'right');

    // Action buttons
    const btnJump = document.getElementById('btn-jump');
    const doJump = (e) => {
        if(e) e.preventDefault();
        if(!isJumping) {
            isJumping = true;
            jumpVelocity = 0.25;
        }
    };
    btnJump.addEventListener('mousedown', doJump);
    btnJump.addEventListener('touchstart', doJump);

    const btnShoot = document.getElementById('btn-shoot');
    const doShoot = (e) => {
        if(e) e.preventDefault();
        shoot();
    };
    btnShoot.addEventListener('mousedown', doShoot);
    btnShoot.addEventListener('touchstart', doShoot);

    // Keyboard fallback
    window.addEventListener('keydown', (e) => {
        if(e.key === 'ArrowUp' || e.key === 'w') keys.forward = true;
        if(e.key === 'ArrowDown' || e.key === 's') keys.backward = true;
        if(e.key === 'ArrowLeft' || e.key === 'a') keys.left = true;
        if(e.key === 'ArrowRight' || e.key === 'd') keys.right = true;
        if(e.key === ' ') doJump();
        if(e.key === 'f') doShoot();
    });

    window.addEventListener('keyup', (e) => {
        if(e.key === 'ArrowUp' || e.key === 'w') keys.forward = false;
        if(e.key === 'ArrowDown' || e.key === 's') keys.backward = false;
        if(e.key === 'ArrowLeft' || e.key === 'a') keys.left = false;
        if(e.key === 'ArrowRight' || e.key === 'd') keys.right = false;
    });

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

function shoot() {
    if (gameState !== 'playing') return;

    const bullet = new THREE.Mesh(
        new THREE.SphereGeometry(0.3),
        new THREE.MeshBasicMaterial({ color: 0xffff00 })
    );

    bullet.position.copy(player.position);
    bullet.position.y += 1;

    // Calculate direction from camera rotation (simplified)
    const dir = new THREE.Vector3(0, 0, -1);
    dir.applyQuaternion(player.quaternion);

    scene.add(bullet);
    bullets.push({ mesh: bullet, dir: dir, life: 100 });
}

function updatePlayer() {
    // Movement relative to player's rotation
    if (keys.forward) player.translateZ(-moveSpeed);
    if (keys.backward) player.translateZ(moveSpeed);
    if (keys.left) player.rotation.y += 0.05;
    if (keys.right) player.rotation.y -= 0.05;

    // Jumping
    if (isJumping) {
        player.position.y += jumpVelocity;
        jumpVelocity -= gravity;
        if (player.position.y <= 1) {
            player.position.y = 1;
            isJumping = false;
        }
    }

    // Boundaries
    if (player.position.x > 95) player.position.x = 95;
    if (player.position.x < -95) player.position.x = -95;
    if (player.position.z > 95) player.position.z = 95;
    if (player.position.z < -95) player.position.z = -95;

    // Check if exited house
    if (!hasExitedHouse && player.position.distanceTo(house.position) > 10) {
        hasExitedHouse = true;
        minimap.classList.remove('hidden');
    }

    // Update minimap
    if (hasExitedHouse) {
        const mapScale = 120 / 200;
        minimapPlayer.style.left = \`\${(player.position.x * mapScale) + 60}px\`;
        minimapPlayer.style.top = \`\${(player.position.z * mapScale) + 60}px\`;
    }

    // Camera follow
    const relativeCameraOffset = new THREE.Vector3(0, 4, 10);
    const cameraOffset = relativeCameraOffset.applyMatrix4(player.matrixWorld);
    camera.position.lerp(cameraOffset, 0.1);
    camera.lookAt(player.position);
}

function updateBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        b.mesh.position.addScaledVector(b.dir, 1.0);
        b.life--;

        // Collision with dragon
        if (dragonHealth > 0 && b.mesh.position.distanceTo(dragon.position) < 5) {
            scene.remove(b.mesh);
            bullets.splice(i, 1);
            dragonHealth--;

            // Flash red
            dragon.children.forEach(c => c.material.color.setHex(0xffffff));
            setTimeout(() => {
                if(dragon) dragon.children.forEach(c => c.material.color.setHex(0xaa0000));
            }, 100);

            if (dragonHealth <= 0) {
                scene.remove(dragon);
                minimapDragon.style.display = 'none';
                setTimeout(endGame, 1000);
            }
            continue;
        }

        if (b.life <= 0) {
            scene.remove(b.mesh);
            bullets.splice(i, 1);
        }
    }
}

function animate() {
    if (gameState !== 'playing') return;

    requestAnimationFrame(animate);

    updatePlayer();
    updateBullets();

    renderer.render(scene, camera);
}

function endGame() {
    gameState = 'gameover';
    gameUI.classList.remove('active');
    gameOverScreen.classList.add('active');
}

// Game Over Controls
const restartGame = (e) => {
    if(e && e.type === 'touchstart') e.preventDefault();
    gameOverScreen.classList.remove('active');
    document.getElementById('game-canvas').remove();
    const newCanvas = document.createElement('canvas');
    newCanvas.id = 'game-canvas';
    gameUI.insertBefore(newCanvas, gameUI.firstChild);
    minimapDragon.style.display = 'block';
    startGame();
};
document.getElementById('restart-btn').addEventListener('click', restartGame);
document.getElementById('restart-btn').addEventListener('touchstart', restartGame);
document.getElementById('restart-btn').addEventListener('pointerdown', restartGame);

const quitGame = (e) => {
    if(e && e.type === 'touchstart') e.preventDefault();
    gameOverScreen.classList.remove('active');
    homeScreen.classList.add('active');
    selectedCharacter = null;
    charGirl.classList.remove('selected');
    startBtn.disabled = true;
    document.getElementById('game-canvas').remove();
    const newCanvas = document.createElement('canvas');
    newCanvas.id = 'game-canvas';
    gameUI.insertBefore(newCanvas, gameUI.firstChild);
};
document.getElementById('quit-btn').addEventListener('click', quitGame);
document.getElementById('quit-btn').addEventListener('touchstart', quitGame);
document.getElementById('quit-btn').addEventListener('pointerdown', quitGame);

const leaveGame = (e) => {
    if(e && e.type === 'touchstart') e.preventDefault();
    window.close(); // Might not work in all browsers, but fits requirement
    // Fallback UI indication
    document.body.innerHTML = "<h1 style='text-align:center; margin-top:50vh; transform:translateY(-50%);'>Game Closed</h1>";
};
document.getElementById('leave-btn').addEventListener('click', leaveGame);
document.getElementById('leave-btn').addEventListener('touchstart', leaveGame);
document.getElementById('leave-btn').addEventListener('pointerdown', leaveGame);
