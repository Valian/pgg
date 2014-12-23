

function HeightmapGenerator(renderer) {
	this.renderer = renderer;
	this.sceneObjects = SceneUtils.createSinglePlaneSceneObjects();
	this.heightmapMaterial = ShaderUtils.loadMaterial('heightmap/terran');

	this.generateTexture = function(width, height, noiseFrequency, startingPoint, interpolationVector, displacementVector) {
		var renderTarget = TextureUtils.createRenderTarget(width, height);

		this.heightmapMaterial.uniforms = {
			noiseFrequency: {type: 'f', value: noiseFrequency},
			startingPoint: {type: '3fv', value: startingPoint},
			interpolationVector: {type: '3fv', value: interpolationVector},
			displacementVector: {type: '3fv', value: displacementVector}
		}
		this.sceneObjects.mesh.material = this.heightmapMaterial;

		this.renderer.render(this.sceneObjects.scene, this.sceneObjects.camera, renderTarget, true);
		return renderTarget;
	};
};
