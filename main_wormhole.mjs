import * as THREE from "three";
import {OrbitControls} from 'jsm/controls/OrbitControls.js';
import {EffectComposer} from "jsm/postprocessing/EffectComposer.js";
import {RenderPass} from "jsm/postprocessing/RenderPass.js";
import {UnrealBloomPass} from "jsm/postprocessing/UnrealBloomPass.js";
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
scene.fog = new THREE.FogExp2(0x000000, 0.3);
// const loader = new THREE.TextureLoader();

// post-processing
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 1.5, 0.4, 100);
bloomPass.threshold = 0.002;
bloomPass.strength = 3.5;
bloomPass.radius = 0;
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

// const points = spline.getPoints(100);
// const geometry = new THREE.BufferGeometry().setFromPoints(points);
// const material = new THREE.LineBasicMaterial({color: 0xff0000});
// const line = new THREE.Line(geometry, material);
// scene.add(line);

const tubeGeo = new THREE.TubeGeometry(spline, 222, 0.65, 32, true);
const tubeMat = new THREE.MeshBasicMaterial(
    {
      color: 0xffffff,
      // side: THREE.DoubleSide,
      wireframe: true
    });
const tube = new THREE.Mesh(tubeGeo, tubeMat);
// scene.add(tube);

const edges = new THREE.EdgesGeometry(tubeGeo, 0.5);
const edgesMaterial = new THREE.LineBasicMaterial({color: 0x00aaff});
const tubeLines = new THREE.LineSegments(edges, edgesMaterial);
scene.add(tubeLines);

// create boxes
const numBoxes = 55;
const size = 0.075;
const boxGeo = new THREE.BoxGeometry(size, size, size);
for (let i = 0; i < numBoxes; i++) {
  const boxMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true
  });
  const box = new THREE.Mesh(boxGeo, boxMat);
  const p = (i / numBoxes + Math.random() * 0.1) % 1;
  const pos = tubeGeo.parameters.path.getPointAt(p);
  pos.x += Math.random() - 0.4;
  pos.z += Math.random() - 0.4;
  // box.position.copy(pos);
  const rote = new THREE.Vector3(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
  );
  // box.rotation.set(rote.x, rote.y, rote.z);
  // scene.add(box);

  const edges = new THREE.EdgesGeometry(boxGeo, 0.2);
  const color = new THREE.Color().setHSL(0.7 - p, 1, 0.5);
  const lineMat = new THREE.LineBasicMaterial({color});
  const boxLines = new THREE.LineSegments(edges, lineMat);
  boxLines.position.copy(pos);
  boxLines.rotation.set(rote.x, rote.y, rote.z);
  scene.add(boxLines);
}

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
  // renderer.render(scene, camera);
  composer.render(scene, camera);
  controls.update();
  requestAnimationFrame(animate);
}

animate();