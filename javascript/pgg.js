

var PGG = function() {
	this.initCameraAndControls = function() {
		this.camera = new THREE.PerspectiveCamera(35, window.innerWidth/window.innerHeight, 0.1, 1000000);
		this.camera.position.z = 2000;

		this.controls = new THREE.FlyControls( this.camera );
		this.controls.movementSpeed = 10000;
		this.controls.domElement = document;
		this.controls.rollSpeed = Math.PI / 24;
		this.controls.autoForward = false;
		this.controls.dragToLook = false;
	};

	this.initScene = function() {
		this.scene = new THREE.Scene();

		var squareGeometry = new THREE.PlaneBufferGeometry(1000, 1000, 100, 100);

		var heightmapGenerator = new HeightmapGenerator(this.renderer);
		var generatedTexture = heightmapGenerator.generateTexture(1000, 1000, 100, [0, 0, 0], [1, 1, 0], [0, 0, 0]);

		var material = ShaderUtils.loadMaterial('simple/texture');
		material.uniforms = {texture: {type: 't', value: generatedTexture}}

		var mesh = new THREE.Mesh(squareGeometry, material);
		this.scene.add(mesh);
	};

	this.initRenderer = function() {
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.sortObjects = false;
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(this.renderer.domElement);
	};

	this.initOthers = function() {
		this.clock = new THREE.Clock();

		this.stats = new THREEx.RendererStats();
		this.stats.domElement.style.position = 'absolute';
		this.stats.domElement.style.top = '0px';
		document.body.appendChild(this.stats.domElement);
	};

	this.run = function() {
		this.initRenderer();
		this.initCameraAndControls();
		this.initScene();
		this.initOthers();

		var that = this;
		function render() {
			var delta = that.clock.getDelta();
			requestAnimationFrame(render);
			that.controls.update(delta);
			that.renderer.render(that.scene, that.camera);
			that.stats.update(that.renderer);
		}
		render();
	};
};
