

var PGG = function() {
	this.initCameraAndControls = function() {
		this.camera = new THREE.PerspectiveCamera(35, window.innerWidth/window.innerHeight, 0.1, 1000000);

		this.controls = new THREE.FlyControls( this.camera );
		this.controls.movementSpeed = 10000;
		this.controls.domElement = document;
		this.controls.rollSpeed = Math.PI / 24;
		this.controls.autoForward = false;
		this.controls.dragToLook = false;
	};

	this.initScene = function() {
		this.scene = new THREE.Scene();
		this.planetManager = new PlanetManager();
		var planet = this.planetManager.createPlanet('lava');
		planet.object.position.z = -60000;
		this.scene.add(planet.object);
	};

	this.initRenderer = function() {
		this.renderer = new THREE.WebGLRenderer({antialias: false});
		this.renderer.sortObjects = false;
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(this.renderer.domElement);
	};

	this.initOthers = function() {
		this.clock = new THREE.Clock();

		this.stats = new Stats();
		this.stats.domElement.style.position = 'absolute';
		this.stats.domElement.style.top = '0px';
		document.body.appendChild(this.stats.domElement);
	};

	this.run = function() {
		this.initCameraAndControls();
		this.initScene();
		this.initRenderer();
		this.initOthers();

		var _this = this;
		function render() {
			var delta = _this.clock.getDelta();
			requestAnimationFrame( render );
			_this.planetManager.update( _this.camera.position );
			_this.controls.update( delta );
			_this.renderer.render(_this.scene, _this.camera);
			_this.stats.update();
		}
		render();
	};
};
