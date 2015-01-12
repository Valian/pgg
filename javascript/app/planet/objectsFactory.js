define(['seededRandom', 'planet/planetTypes', 'planet/planet'],
	function(SeededRandom, planetTypes, Planet) {

	function ObjectsFactory() {

		this.randomPlanetAttributes = function(sr, planetType) {
			var attributes = {
				planetRadius: sr.nextRandomFloatFromRange(planetType.planetRadiusMin,
					planetType.planetRadiusMax),
				planetSurface: sr.nextRandomFloatFromRange(planetType.planetSurfaceMin,
					planetType.planetSurfaceMax)`,
				material: planetType.material.clone()
			};

			attributes.material.uniforms.planetRadius = { type: "f", value: attributes.planetRadius };
			attributes.material.uniforms.planetSurface = { type: "f", value: attributes.planetSurface };

			return attributes;
		};

		this.createPlanet = function(seed) {
			var sr = SeededRandom.new(seed);

			var planetType = sr.randomArrayElement(planetTypes.types);
			var planetAttributes = this.randomPlanetAttributes(sr, planetType);

			return new Planet(planetAttributes.material, planetAttributes.planetRadius,
				planetAttributes.planetSurface, planetType, seed);
		};

		this.createSun = function(seed) {
			var sr = SeededRandom.new(seed);
		};
	}

	return {
		new: function() { return new ObjectsFactory(); }
	};
});
