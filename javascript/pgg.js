

var PGG = function() {
	this.initCameraAndControls = function() {
		//this.camera = new THREE.PerspectiveCamera(35, window.innerWidth/window.innerHeight, 0.1, 1000000);
		//this.camera = new THREE.OrthographicCamera(000, 100, 000, 100, 1, 1000);
		//OrthographicCamera( left, right, top, bottom, near, far )

		//this.controls = new THREE.FlyControls( this.camera );
		//this.controls.movementSpeed = 10000;
		//this.controls.domElement = document;
		//this.controls.rollSpeed = Math.PI / 24;
		//this.controls.autoForward = false;
		//this.controls.dragToLook = false;
	};

	this.initScene = function() {
		this.scene = new THREE.Scene();
		this.planetManager = new PlanetManager();
/*
		var geometry = new THREE.SphereGeometry( 500, 32, 32 );
		var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
		var sphere = new THREE.Mesh( geometry, material );
		sphere.position.z = 500;
		sphere.position
		this.scene.add( sphere );
*/

		//this.camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 1, 100);
		this.camera = new THREE.OrthographicCamera(0, 1, 0, 1, 1, 1000);
		this.camera.position.set(0, 0, 1);
		this.camera.lookAt(this.scene.position);
		this.scene.add(this.camera); 

		var squareGeometry = new THREE.Geometry();
		squareGeometry.vertices.push(new THREE.Vector3(0, 1, 0));
		squareGeometry.vertices.push(new THREE.Vector3(1, 1, 0));
		squareGeometry.vertices.push(new THREE.Vector3(1, 0, 0));
		squareGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
		squareGeometry.faces.push(new THREE.Face3(0, 1, 2));
		squareGeometry.faces.push(new THREE.Face3(0, 2, 3));

		var staticLoader = new StaticLoader();
		var shaderCode = staticLoader.loadShader('heightmap/terran');
		var shaderMaterial = new THREE.ShaderMaterial({
			vertexShader: shaderCode.vertexShader,
			fragmentShader: shaderCode.fragmentShader,
			uniforms: {
				xDisp: {type: 'f', value: 100 * Math.random()},
				yDisp: {type: 'f', value: 100 * Math.random()},
				zDisp: {type: 'f', value: 100 * Math.random()},
				noiseFrequency: {type: 'f', value: 10},
				startingPoint: {type: '3f', value: new THREE.Vector3(0, 0, 0)},
				dx: {type: 'f', value: 1},
				dy: {type: 'f', value: 1},
				dz: {type: 'f', value: 0},
			}
		});

		var triangleMesh = new THREE.Mesh(squareGeometry, shaderMaterial);
		this.scene.add(triangleMesh); 

		/*
		this.scene.add(this.planetManager.container);

		var planet = this.planetManager.createPlanet('test');
		planet.position.z = -60000;
		*/
	};

	this.initRenderer = function() {
		this.renderer = new THREE.WebGLRenderer({antialias: false});
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
		this.initCameraAndControls();
		this.initScene();
		this.initRenderer();
		this.initOthers();

		var _this = this;
		function render() {
			var delta = _this.clock.getDelta();
			requestAnimationFrame( render );
			_this.planetManager.update( _this.camera );
			//_this.controls.update( delta );
			_this.renderer.render(_this.scene, _this.camera);
			_this.stats.update(_this.renderer);
		}
		render();
	};
};
