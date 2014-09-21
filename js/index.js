var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var geometry = new THREE.SphereGeometry(3,16,8);
var material = new THREE.LineBasicMaterial({color: 0x00ff00, linewidth: 2, wireframe: true});
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

var render = function () {
  requestAnimationFrame(render);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
};

render();