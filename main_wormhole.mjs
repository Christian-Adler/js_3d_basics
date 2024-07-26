import * as THREE from "three";
import {OrbitControls} from 'jsm/controls/OrbitControls.js';
import spline from "./mjs/spline.mjs";

let width = window.innerWidth;
let height = window.innerHeight;

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.LinearSRGBColorSpace; // important
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(75, 1.5, 0.1, 1000);
camera.position.z = 5;

const updateWorldSettings = () => {
  width = window.innerWidth;
  height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
};

window.addEventListener('resize', updateWorldSettings, false);
updateWorldSettings();

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.01;

const scene = new THREE.Scene();
// const loader = new THREE.TextureLoader();

// const points = spline.getPoints(100);
// const geometry = new THREE.BufferGeometry().setFromPoints(points);
// const material = new THREE.LineBasicMaterial({color: 0xff0000});
// const line = new THREE.Line(geometry, material);
// scene.add(line);

const tubeGeo = new THREE.TubeGeometry(spline, 222, 0.65, 16, true);
const tubeMat = new THREE.MeshStandardMaterial(
    {
      color: 0xffffff,
      // side: THREE.DoubleSide,
      wireframe: true
    });
const tube = new THREE.Mesh(tubeGeo, tubeMat);
scene.add(tube);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x505050);
scene.add(hemiLight);

const updateCamera = (t) => {
  const time = t * 0.5;
  const loopTime = 20 * 1000;
  const posOfLoop = (time % loopTime) / loopTime;
  const pos = tubeGeo.parameters.path.getPointAt(posOfLoop);
  const lookAt = tubeGeo.parameters.path.getPointAt((posOfLoop + 0.01) % 1);
  camera.position.copy(pos);
  camera.lookAt(lookAt);
};

function animate(t = 0) {
  // Scene Updates
  updateCamera(t);
  // Render & loop
  renderer.render(scene, camera);
  controls.update();
  requestAnimationFrame(animate);
}

animate();