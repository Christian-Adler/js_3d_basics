import * as THREE from "three";
import {OrbitControls} from 'jsm/controls/OrbitControls.js';
import getStarfield from "./js/starfield.mjs";

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

const earthGroup = new THREE.Group();
earthGroup.rotation.z = -23.4 * Math.PI / 180;
scene.add(earthGroup);

const geo = new THREE.IcosahedronGeometry(1, 12);
const mat = new THREE.MeshStandardMaterial({
  // color: 0xffff00,
  // flatShading: true,
  map: loader.load('./assets/textures/00_earthmap1k.jpg'),
  // map: loader.load('./assets/textures/moonmap4k.jpg'),
});
const earthMesh = new THREE.Mesh(geo, mat);
earthGroup.add(earthMesh);

const lightsMat = new THREE.MeshBasicMaterial({
  // color: 0x00ff00,
  // transparent: true,
  // opacity: 0.4,
  map: loader.load('./assets/textures/03_earthlights1k.jpg'),
  blending: THREE.AdditiveBlending
});
const lightsMesh = new THREE.Mesh(geo, lightsMat);
earthGroup.add(lightsMesh);

const stars = getStarfield({numStars: 2000});
scene.add(stars);

// const hemiLight = new THREE.HemisphereLight(0xffffff, 0x505050);
// scene.add(hemiLight);
const sunLight = new THREE.DirectionalLight(0xffffff);
sunLight.position.set(-2, 0.5, 1.5);
scene.add(sunLight);

function animate(/*t = 0*/) {
  requestAnimationFrame(animate);

  // earthMesh.rotation.x += 0.001;
  earthMesh.rotation.y += 0.001;
  lightsMesh.rotation.y += 0.001;

  renderer.render(scene, camera);
  controls.update();
}

animate();
