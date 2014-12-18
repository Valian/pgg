

function TextureGenerator(renderer) {
	this.renderer = renderer;
	this.staticLoader = new StaticLoader();
	this.heightmapShader = (function() {
		var heightmapShaderFactory = new HeightmapShaderFactory();
		var heightmapShader = heightmapShaderFactory.createHeightmapShader('terran');
		return heightmapShader;
	})();

	this.createRenderTarget = function(width, height) {
		var renderTarget = new THREE.WebGLRenderTarget(width, height,
			{minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.LuminanceFormat});
		return renderTarget;
	};

	this.createCamera = function() {
		var camera = new THREE.OrthographicCamera(0, 1, 0, 1, 1, 1000);
		camera.position.set(0, 0, 1);
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
		this.hei
	};
};

/*
	this.createTextureGenerationShader = function(noiseFrequency, startingPoint, interpolationVector, displacementVector) {
		var shaderCode = this.staticLoader.loadShader('heightmap/terrain');
		var shaderMaterial = new THREE.ShaderMaterial({
			vertexShader: shaderCode.vertexShader,
			fragmentShader: shaderCode.fragmentShader,
			uniforms: {
				noiseFrequency: {type: 'f', value: noiseFrequency},
				startingPoint: {type: '3fv', value: startingPoint},
				interpolationVector: {type: '3fv', value: interpolationVector},
			}
		});
		return shaderMaterial;
	};
*/