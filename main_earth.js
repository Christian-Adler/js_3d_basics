import * as THREE from "three";
import {OrbitControls} from 'jsm/controls/OrbitControls.js';

const w = window.innerWidth;
const h = window.innerHeight;
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 5;

const scene = new THREE.Scene();

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.01;

const loader = new THREE.TextureLoader();

const geo = new THREE.IcosahedronGeometry(1, 12);
const mat = new THREE.MeshStandardMaterial({
  // color: 0xffff00,
  // flatShading: true,
  map: loader.load('./assets/textures/00_earthmap1k.jpg'),
  // map: loader.load('./assets/textures/moonmap4k.jpg'),
});
const earthMesh = new THREE.Mesh(geo, mat);
scene.add(earthMesh);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x505050);
scene.add(hemiLight);

function animate(t = 0) {
  requestAnimationFrame(animate);

  earthMesh.rotation.x += 0.001;
  earthMesh.rotation.y += 0.001;

  renderer.render(scene, camera);
  controls.update();
}

animate();
