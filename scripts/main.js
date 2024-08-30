if(localStorage.getItem("popupShown")!="true"){
    document.getElementById("popup").style.display="block";
}
var popupContent = document.getElementById("popup-content");
function changePopup(){
    popupContent.innerHTML=`
    <button id="close">&times;</button>
    <h1>Some instructions before takeoff</h1>
    <h2>Controls:</h2>
    <p>Left and right arrow to roll and yaw left and right</p>
    <p>Keys 0-9 for throttle</p>
    <p>Up and down arrow to pitch up and down</p>
    <p>Click and drag to rotate, and scroll to zoom</p>
    <button onclick="closePopup()">FLY!</button>
    `;
}
function closePopup(){
    document.getElementById("popup").style.display="none";
    localStorage.setItem("popupShown", "true");
}
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x87CEEB);  // Sky blue background color
document.body.appendChild(renderer.domElement);

// Add Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5); // Color, Intensity
scene.add(ambientLight);

// Add a stronger Directional Light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(0, 5, 5).normalize();
scene.add(directionalLight);

// Create the terrain (simple plane with a grass texture)
const terrainGeometry = new THREE.PlaneGeometry(10000, 10000, 32, 32);
const textureLoader = new THREE.TextureLoader();
textureLoader.load('./Assets/img/texture.png', function(texture) {
const terrainMaterial = new THREE.MeshLambertMaterial({ map: texture });
const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
terrain.rotation.x = -Math.PI / 2; // Rotate the plane to make it horizontal
terrain.position.y = 0; // Ensure the plane is at ground level
scene.add(terrain);
console.log('Terrain added to the scene');
}, undefined, function(error) {
console.error('Error loading texture:', error);
});


// Create mountains using cone geometry
function createMountain(x, z) {
    const mountainGeometry = new THREE.ConeGeometry(5, 5, 32);
    const mountainMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 }); // Brown color for mountains
    const mountain = new THREE.Mesh(mountainGeometry, mountainMaterial);
    mountain.position.set(x, 0, z);
    scene.add(mountain);
}
createMountain(-20, -20);
createMountain(30, -10);
createMountain(10, 10);

// Create a runway
function createRunway(x, z) {
    const runwayGeometry = new THREE.PlaneGeometry(5, 50);
    const runwayMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 }); // Dark grey for the runway
    const runway = new THREE.Mesh(runwayGeometry, runwayMaterial);
    runway.rotation.x = -Math.PI / 2; // Rotate the runway to be flat on the ground
    runway.position.set(x, 0.01, z); // Slightly above the terrain to avoid z-fighting
    scene.add(runway);
}
createRunway(0, 0);
createRunway(-10, 20);

let model;
let throttle = 0; // Initialize throttle at 0%
const cameraOffset = new THREE.Vector3(0, 3, 10); // Offset for the camera relative to the model

const loader = new THREE.GLTFLoader();
function applyTextureToLargePlane(model, texturePath) {
const textureLoader = new THREE.TextureLoader();
textureLoader.load(texturePath, function(texture) {
model.traverse(function(child) {
    if (child.isMesh) {
        child.material.map = texture;
        child.material.needsUpdate = true;
    }
});
}, undefined, function(error) {
console.error('Error loading texture:', error);
});
}

loader.load('./Assets/glTF/embraer__phenom_300e_ar_v006/scene.gltf', function (gltf) {
    model = gltf.scene;
    model.rotation.y = Math.PI / 1;  // 90 degrees yaw
    model.rotation.x = 0;
    model.position.z = 25;
    model.position.y=1;
    model.scale.set(0.4, 0.4, 0.4);
    scene.add(model);
}, undefined, function (error) {
    console.error(error);
});
document.addEventListener('DOMContentLoaded', () => {
const selectPlaneButton = document.getElementById('selectPlaneButton');
const planePopup = document.getElementById('planePopup');
const closeBtn = document.querySelector('.close');
const planeOptions = document.querySelectorAll('.plane-option');
const sevenOptions = document.querySelectorAll('.option747');
const sideOptions = document.querySelectorAll('.optionSideways');
const bigOptions = document.querySelectorAll('.optionBig');
const smallOptions = document.querySelectorAll('.optionSmall');
selectPlaneButton.addEventListener('click', () => {
planePopup.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
planePopup.style.display = 'none';
});

window.addEventListener('click', (event) => {
if (event.target == planePopup) {
    planePopup.style.display = 'none';
}
});

planeOptions.forEach(option => {
option.addEventListener('click', (event) => {
    const modelPath = event.target.getAttribute('data-model');
    loadModel(modelPath);
    planePopup.style.display = 'none';
});
});
sevenOptions.forEach(option => {
option.addEventListener('click', (event) => {
    const modelPath = event.target.getAttribute('data-model');
    load747(modelPath);
    planePopup.style.display = 'none';
});
});
sideOptions.forEach(option => {
option.addEventListener('click', (event) => {
    const modelPath = event.target.getAttribute('data-model');
    loadSideways(modelPath);
    planePopup.style.display = 'none';
});
});
bigOptions.forEach(option => {
option.addEventListener('click', (event) => {
    const modelPath = event.target.getAttribute('data-model');
    loadBig(modelPath);
    planePopup.style.display = 'none';
});
});
smallOptions.forEach(option => {
option.addEventListener('click', (event) => {
    const modelPath = event.target.getAttribute('data-model');
    loadSmall(modelPath);
    planePopup.style.display = 'none';
});
});
function loadModel(modelPath) {
if (model) {
    scene.remove(model);
}
loader.load(modelPath, function (gltf) {
    model = gltf.scene;
    model.rotation.y = Math.PI / 1;  // 90 degrees yaw
    model.rotation.x = 0;
    model.position.z = 25;
    model.position.y = 1;
    model.scale.set(0.4, 0.4, 0.4);
    scene.add(model);
}, undefined, function (error) {
    console.error(error);
});
}
function load747(modelPath) {
if (model) {
    scene.remove(model);
}
loader.load(modelPath, function (gltf) {
    model = gltf.scene;
    model.rotation.y = Math.PI / 1;  // 90 degrees yaw
    model.rotation.x = 0;
    model.position.z = 25;
    model.position.y = 1;
    model.scale.set(0.2, 0.2, 0.2);
    scene.add(model);
}, undefined, function (error) {
    console.error(error);
});
}
function loadBig(modelPath) {
if (model) {
    scene.remove(model);
}
loader.load(modelPath, function (gltf) {
    model = gltf.scene;
    model.rotation.y = Math.PI / 1;  // 90 degrees yaw
    model.rotation.x = 0;
    model.position.z = 25;
    model.position.y = 1;
    model.scale.set(0.7, 0.7, 0.7);
    scene.add(model);
}, undefined, function (error) {
    console.error(error);
});
}
function loadSmall(modelPath) {
if (model) {
    scene.remove(model);
}
loader.load(modelPath, function (gltf) {
    model = gltf.scene;
    model.rotation.y = Math.PI / 1;  // 90 degrees yaw
    model.rotation.x = 0;
    model.position.z = 25;
    model.position.y = 1;
    model.scale.set(0.004, 0.004, 0.004);
    scene.add(model);
}, undefined, function (error) {
    console.error(error);
});
}
});




camera.position.set(0, 3, 28); // Initial camera position

// Add OrbitControls for camera interaction
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Enable damping (inertia)
controls.dampingFactor = 0.05; // Damping inertia

// Track key presses
const controlsSpeed = 0.01; // Increased speed for better control
const keyState = {};

document.addEventListener('keydown', (event) => {
    keyState[event.code] = true;
    handleThrottle(event); // Handle throttle key presses
});

document.addEventListener('keyup', (event) => {
    keyState[event.code] = false;
});

document.addEventListener('keydown', (event) => {
if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.code)) {
event.preventDefault(); // Prevent default behavior (e.g., scrolling)
}
keyState[event.code] = true;
});

document.addEventListener('keyup', (event) => {
if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.code)) {
event.preventDefault(); // Prevent default behavior (e.g., scrolling)
}
keyState[event.code] = false;
});

function handleThrottle(event) {
    if (event.code.startsWith('Digit') && event.code !== 'Digit0') {
        throttle = parseInt(event.code.replace('Digit', '')) * 10; // Set throttle to corresponding percentage
    } else if (event.code === 'Digit0') {
        throttle = 0; // Set throttle to 0%
    }
}

function updateModelRotation() {
    if (model) {
        if (keyState['ArrowLeft']) {
            model.rotation.z -= controlsSpeed; // Roll left
        }
        if (keyState['ArrowRight']) {
            model.rotation.z += controlsSpeed; // Roll right
        }
        if (keyState['ArrowUp']) {
            model.rotation.x -= controlsSpeed; // Pitch up
        }
        if (keyState['ArrowDown']) {
            model.rotation.x += controlsSpeed; // Pitch down
        }
        if (keyState['Comma']) {
            model.rotation.y += controlsSpeed; // Yaw left
        }
        if (keyState['Period']) {
            model.rotation.y -= controlsSpeed; // Yaw right
        }
        // Apply throttle to move the model forward along the z-axis
        model.translateZ(throttle * 0.003); // Move the model forward
    }
}
let isMouseDown = false;

document.addEventListener('mousedown', () => {
isMouseDown = true;
});

document.addEventListener('mouseup', () => {
isMouseDown = false;
});

function updateCameraPosition() {
if (model && !isMouseDown) {
// Calculate the desired camera position relative to the model
const relativeCameraPosition = cameraOffset.clone().applyMatrix4(model.matrixWorld);

// Smoothly interpolate the camera's position to follow the model
camera.position.lerp(relativeCameraPosition, 0.03);

// Ensure the camera is always looking at the model
camera.lookAt(model.position);

// Update OrbitControls target to the model's position
controls.target.copy(model.position);
}
}
let hasCrashed = false; // Flag to track if the crash alert has been shown

function animate() {
requestAnimationFrame(animate);

updateModelRotation(); // Update model rotation based on key presses

if (!isMouseDown) {
updateCameraPosition(); // Update camera focus and position relative to the model
}

controls.update(); // Update controls

renderer.render(scene, camera);

// Check if the model has crashed
if (model.position.y < 0 && model.position.z < -30 && !hasCrashed) {
hasCrashed = true; // Set the crash flag to true
document.getElementById('crashMessage').style.display = 'block'; // Show the crash alert
}

// Debugging logs
console.log(`Model position: y=${model.position.y}, z=${model.position.z}`);
}
animate();