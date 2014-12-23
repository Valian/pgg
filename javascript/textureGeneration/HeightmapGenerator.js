

function HeightmapGenerator(renderer) {
	this.renderer = renderer;

	this.heightmapShader = (function() {
		var heightmapShaderFactory = new HeightmapShaderFactory();
		var heightmapShader = heightmapShaderFactory.createHeightmapShader('terran');
		return heightmapShader;
	})();

	this.generateTexture = function(width, height, noiseFrequency, startingPoint, interpolationVector, displacementVector) {
		var renderTarget = TextureUtils.createRenderTarget(width, height);

		this.heightmapShader.noiseFrequency = noiseFrequency;
		this.heightmapShader.interpolationVector = interpolationVector;
		this.heightmapShader.displacementVector = displacementVector;

		var sceneObjects = SceneUtils.createSinglePlaneSceneObjects();
		sceneObjects.mesh.material = this.heightmapShader.getShaderMaterial();

		this.renderer.render(sceneObjects.scene, sceneObjects.camera, renderTarget, true);
		return renderTarget;
	};
};
