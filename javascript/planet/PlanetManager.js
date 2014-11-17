

var PlanetManager = function() {
	this.planetGeometry = new THREE.SphereGeometry(10000, 250, 250);

	var shaderProvider = new ShaderProvider();
	this.planetMaterial = shaderProvider.getShaderMaterial('planetSurface');

	this.planets = [];

	this.createPlanet = function(waterLevel) {
		var planetShaderMaterial = this.planetMaterial.clone();
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
};