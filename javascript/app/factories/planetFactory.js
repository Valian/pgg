define(['utils/seededRandom', 'planet/planetTypes', 'planet/planet', 'seedrandom'],
	function(SeededRandom, planetTypes, Planet, seedrandom) {

	function PlanetFactory(factorySeed) {
		this.factorySeed = factorySeed;
		this.createPlanet = createPlanet;
		this.generateRandomPlanetAttributes = generateRandomPlanetAttributes;

	    function createPlanet(seed) {
	    	var seededRandom = new SeededRandom(this.factorySeed + seed);

	        var planetType = seededRandom.randomArrayElement(planetTypes);
	        var attributes = this.generateRandomPlanetAttributes(planetType, seededRandom);

	        return new Planet(attributes.material, attributes.planetRadius,
	        	attributes.planetSurface, planetType, seed);
	    }

	    function generateRandomPlanetAttributes(planetType, seededRandom) {
	        var attributes = {
	            planetRadius: seededRandom.nextRandomFloatFromRange(planetType.planetRadius.min,
	            	planetType.planetRadius.max),
	            planetSurface: seededRandom.nextRandomFloatFromRange(planetType.planetSurface.min,
	            	planetType.planetSurface.max),
	            material: planetType.material.clone()
	        };

	        attributes.material.uniforms.planetRadius = { type: "f", value: attributes.planetRadius };
	        attributes.material.uniforms.planetSurface = { type: "f", value: attributes.planetSurface };

	        return attributes;
	    }
	}

	return PlanetFactory;
});
