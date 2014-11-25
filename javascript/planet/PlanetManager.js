

var PlanetManager = function() {
	this.planetGeometry = new THREE.SphereGeometry(10000, 250, 250);

	var shaderProvider = new ShaderProvider();
	this.planetMaterials = {
		terran: shaderProvider.getShaderMaterial('planet/terran'),
		desert: shaderProvider.getShaderMaterial('planet/desert')
	};

	this.planets = [];

	this.createPlanet = function(waterLevel) {
		var planetShaderMaterial = this.planetMaterials.terran.clone();
		planetShaderMaterial.uniforms = {
			waterLevel: {
				type: 'f',
				value: waterLevel
			},
			planetSeed: {
				type: 'f',
				value: Math.random()
			},
			planetDetails: {
				type: 'i',
				value: PLANET_DETAILS.LOW
			}
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