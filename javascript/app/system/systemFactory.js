define(['utils/seededRandom', 'config', 'utils/math', 'factories/planetFactory', 'system/system'],
	function(SeededRandom, config, MathUtils, PlanetFactory, System) {

	var systemFactoryConfig = config.config.systemFactory;

	function SystemFactory(factorySeed) {
		this.factorySeed = factorySeed;

		this.createSystem = function(systemSeed) {
			var seededRandom = new SeededRandom(factorySeed + systemSeed);
			var numberOfPlanets = this.generateNumberOfPlanets(seededRandom);
			var orbitsRadiuses = this.generateOrbitsRadiuses(seededRandom, numberOfPlanets);
			var planetsPositions = this.generatePlanetsPositions(seededRandom, orbitsRadiuses);
			var planetFactory = new PlanetFactory(seededRandom.nextRandomFloat());
			var planets = [];
			for(var i=0; i<numberOfPlanets; i++) {
				var planet = planetFactory.createPlanet(seededRandom.nextRandomFloat());
				planet.position.x = planetsPositions[i][0];
				planet.position.y = planetsPositions[i][1];
				planet.position.z = planetsPositions[i][2];
				planets.push(planet);
			}
			return new System(null, planets);
		};

		this.generateNumberOfPlanets = function(systemSeededRandom) {
			return systemSeededRandom.nextRandomIntFromRange(
				systemFactoryConfig.numberOfPlanets.min,
				systemFactoryConfig.numberOfPlanets.max
			);
		};

		this.generateOrbitsRadiuses = function(systemSeededRandom, numberOfPlanets) {
			var radiuses = [];
			var currentRadius = 0;
			for(var i=0; i<numberOfPlanets; i++) {
				var radius = systemSeededRandom.nextRandomFloatFromRange(
					systemFactoryConfig.orbitRadiusDelta.min,
					systemFactoryConfig.orbitRadiusDelta.max
				);
				currentRadius += radius;
				radiuses.push(currentRadius);
			}
			return radiuses;
		};

		this.generatePlanetsPositions = function(systemSeededRandom, orbitsRadiuses) {
			var planetsPositions = [];
			for(var i=0; i<orbitsRadiuses.length; i++) {
				var theta = systemSeededRandom.nextRandomFloatFromRange(0, 2*Math.PI);
				var phi = systemSeededRandom.nextRandomFloatFromRange(0, 2*Math.PI);
				planetsPositions.push(MathUtils.sphericalToCartesian(orbitsRadiuses[i], theta, phi))
			}
			return planetsPositions;
		};
	}

	return SystemFactory;
});