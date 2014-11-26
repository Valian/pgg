

var PlanetManager = function() {
	this.planetGeometry = new THREE.SphereGeometry(10000, 250, 250);

	var shaderProvider = new ShaderProvider();
	this.planetMaterials = {
		terran: shaderProvider.getShaderMaterial('planet/terran'),
		desert: shaderProvider.getShaderMaterial('planet/desert'),
		lava: shaderProvider.getShaderMaterial('planet/lava'),
	};

	this.planets = [];

	this.createLavaPlanet = function() {
		var planetShaderMaterial = this.planetMaterials.lava.clone();
		planetShaderMaterial.uniforms = {
			planetSeed: {
				type: 'f',
				value: Math.random()
			},
		};
		var planet = new Planet(this.planetGeometry, planetShaderMaterial);
		this.planets.push(planet);
		return planet;
	};

	this.createDesertPlanet = function() {
		var planetShaderMaterial = this.planetMaterials.desert.clone();
		planetShaderMaterial.uniforms = {
			planetSeed: {
				type: 'f',
				value: Math.random()
			},
		};
		var planet = new Planet(this.planetGeometry, planetShaderMaterial);
		this.planets.push(planet);
		return planet;
	};
};