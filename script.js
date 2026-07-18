import * as THREE from "three";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth/window.innerHeight,
    0.1,
    1000
);

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);

// Controls

const controls = new PointerLockControls(camera, document.body);

const start = document.getElementById("startScreen");

start.addEventListener("click", ()=>{
    controls.lock();
});

controls.addEventListener("lock", ()=>{
    start.style.display="none";
});

controls.addEventListener("unlock", ()=>{
    start.style.display="flex";
});

// Camera

camera.position.set(0, -48, 0);

// Lighting

scene.add(new THREE.AmbientLight(0xffffff,1));

// Cube size

const size = 100;

// Skybox texture

const loader = new THREE.TextureLoader();
const tex = loader.load("forest.jpg");

// Create cube

const wallMaterial = new THREE.MeshBasicMaterial({
    map: tex,
    side: THREE.BackSide
});

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(size,size,size),
    wallMaterial
);

scene.add(cube);

// Ground

const groundTexture = loader.load("dirt.jpg");
groundTexture.wrapS = THREE.RepeatWrapping;
groundTexture.wrapT = THREE.RepeatWrapping;
groundTexture.repeat.set(25, 25);

const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(size, size),
    new THREE.MeshBasicMaterial({
        map: groundTexture
    })
);

ground.rotation.x = -Math.PI / 2;
ground.position.y = -size / 2 + 0.01;

scene.add(ground);

// Movement

const keys = {};

document.addEventListener("keydown",(e)=>{
    keys[e.key.toLowerCase()] = true;
});

document.addEventListener("keyup",(e)=>{
    keys[e.key.toLowerCase()] = false;
});

const velocity = new THREE.Vector3();

function updateMovement(){

    velocity.set(0,0,0);

    if(keys["w"]) velocity.z -= 1;
    if(keys["s"]) velocity.z += 1;
    if(keys["a"]) velocity.x -= 1;
    if(keys["d"]) velocity.x += 1;

    velocity.normalize();

const speed = 0.25;

controls.moveRight(velocity.x * speed);
controls.moveForward(-velocity.z * speed);

    // Clamp player inside cube

    camera.position.x = THREE.MathUtils.clamp(camera.position.x,-48,48);
    camera.position.z = THREE.MathUtils.clamp(camera.position.z,-48,48);
    camera.position.y = -48;
}

function animate(){

    requestAnimationFrame(animate);

    updateMovement();

    renderer.render(scene,camera);
}

animate();

window.addEventListener("resize",()=>{

    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth,window.innerHeight);

});
