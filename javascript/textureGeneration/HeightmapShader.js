

function HeightmapShaderFactory() {
	this.staticLoader = new StaticLoader();

	this.createHeightmapShader = function(name) {
		var shaderCode = this.staticLoader.loadShader('heightmap/' + name);
		var shaderMaterial = new THREE.ShaderMaterial({
			vertexShader: shaderCode.vertexShader,
			fragmentShader: shaderCode.fragmentShader,
		});
		return new HeightmapShader(shaderMaterial);
	};
};


var HEIGHTMAP_MODE = {
	XY: 0,
	XZ: 1,
	YZ: 2,
};


function HeightmapShader(shaderMaterial) {
	this.shaderMaterial = shaderMaterial;

	this.noiseFrequency = 1;
	this.startingPoint = [0, 0, 0];
	this.interpolationVector = [1, 1, 1];

	this.getShaderMaterial = function() {
		this.shaderMaterial.uniforms = {
			noiseFrequency: {type: 'f', value: this.noiseFrequency},
			startingPoint: {type: '3fv', value: this.startingPoint},
			interpolationVector: {type: '3fv', value: this.interpolationVector},
			mode: {type: 'i', value: HEIGHTMAP_MODE.XY},
		}
		return this.shaderMaterial;
	};
};
