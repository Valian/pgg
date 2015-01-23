define(['three', 'skybox/skyboxFactory', 'system/systemFactory'],
	function(THREE, SkyboxFactory, SystemFactory) {

	function Galaxy(seed) {
		var that = this;

		this.skyboxFactory = new SkyboxFactory(seed);
		this.systemFactory = new SystemFactory(seed);
		this.currentIndices = null;
		this.currentSystem = null;
		this.currentSkybox = null;

		this.setCurrentSystemIndices = setCurrentSystemIndices;
		this.update = update;

		function setCurrentSystemIndices(x, y, z) {
			this.currentIndices = new THREE.Vector3(x, y, z);
			this.currentSystem = this.systemFactory.createSystem(x, y, z);
			this.currentSkybox = this.skyboxFactory.createSkybox(x, y, z);
		}

		function update(camera) {
			this.currentSystem.update(camera);
			this.currentSkybox.update(camera);
		}
	}

	return Galaxy;
});
