

function HeightmapGenerator(renderer) {
	this.renderer = renderer;
	this.staticLoader = new StaticLoader();
	this.heightmapShader = (function() {
		var heightmapShaderFactory = new HeightmapShaderFactory();
		var heightmapShader = heightmapShaderFactory.createHeightmapShader('terran');
		return heightmapShader;
	})();

	this.createRenderTarget = function(width, height) {
		var renderTarget = new THREE.WebGLRenderTarget(width, height,
			{minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat});
		return renderTarget;
	};

	this.createCamera = function(scene) {
		var camera = new THREE.OrthographicCamera(0, 1, 0, 1, 1, 1000);
		camera.position.set(0, 0, 1);
		camera.lookAt(scene.position);
		scene.add(camera);
		return camera;
	};

	this.createGeometry = function() {
		var squareGeometry = new THREE.Geometry();

		squareGeometry.vertices.push(new THREE.Vector3(0, 1, 0));
		squareGeometry.vertices.push(new THREE.Vector3(1, 1, 0));
		squareGeometry.vertices.push(new THREE.Vector3(1, 0, 0));
		squareGeometry.vertices.push(new THREE.Vector3(0, 0, 0));

		squareGeometry.faces.push(new THREE.Face3(0, 1, 2));
		squareGeometry.faces.push(new THREE.Face3(0, 2, 3));

		return squareGeometry;
	};

	this.generateTexture = function(width, height, noiseFrequency, startingPoint, interpolationVector, displacementVector) {
		var fakeScene = new THREE.Scene();
		var renderTarget = this.createRenderTarget(width, height);

		this.heightmapShader.noiseFrequency = noiseFrequency;
		this.heightmapShader.interpolationVector = interpolationVector;
		this.heightmapShader.displacementVector = displacementVector;

		var fakeCamera = this.createCamera(fakeScene);

		var geometry = this.createGeometry();
		var material = this.heightmapShader.getShaderMaterial();
		var mesh = new THREE.Mesh(geometry, material);
		fakeScene.add(mesh);

		this.renderer.render(fakeScene, fakeCamera, renderTarget, true);
		return renderTarget;
	};
};

/*
		this.camera = new THREE.OrthographicCamera(0, 1, 0, 1, 1, 1000);
		this.camera.position.set(0, 0, 1);
		this.camera.lookAt(this.scene.position);
		this.scene.add(this.camera); 
*/