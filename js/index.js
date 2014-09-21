
var stats, clock, container;

var camera, controls, scene, renderer;


init();
animate();

function init()
{
  container = $('#canvas')

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, container.width()/container.height(), 0.1, 1000);
  controls = new THREE.FirstPersonControls( camera );
  controls.movementSpeed = 1;
  controls.lookSpeed = 0.125;
  controls.lookVertical = true;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(container.width(), container.height());
  container.append(renderer.domElement);

  clock = new THREE.Clock();

  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.top = '0px';
  container.append( stats.domElement );

  var geometry = new THREE.SphereGeometry(30,100, 100);
  var material = new THREE.MeshBasicMaterial({color: 0x00ff00, wireframe: true});
  var cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  camera.position.z = 40;
}

function animate() {

  requestAnimationFrame( animate );

  render();
  stats.update();

}

function render() {

  controls.update( clock.getDelta() );
  renderer.render( scene, camera );

}
