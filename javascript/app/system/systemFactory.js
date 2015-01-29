define(['utils/seededRandom', 'config', 'utils/math', 'factories/planetFactory', 'system/system'],
    function(SeededRandom, config, MathUtils, PlanetFactory, System) {

    var systemFactoryConfig = config.config.systemFactory;

    function SystemFactory(factorySeed) {

        var that = this;

        this.factorySeed = factorySeed;
        this.orbitDelta = systemFactoryConfig.orbitRadiusDelta;
        this.planetsRange = systemFactoryConfig.numberOfPlanets;
        this.distanceFromSun = systemFactoryConfig.distanceFromSun;

        this.createSystem = createSystem;

        function createSystem(x, y, z) {

            var seed = factorySeed + x + y + z;

            var planetFactory = new PlanetFactory(seed);
            var seededGen = new SeededRandom(seed);
            var numberOfPlanets = seededGen.nextRandomIntFromRange(that.planetsRange);
            var planets = [];
            var currentRadius = seededGen.nextRandomFloatFromRange(that.distanceFromSun);

            for(var i=0; i<numberOfPlanets; i++) {

                var planetSeed = seededGen.nextRandomFloat();
                var planet = planetFactory.createPlanet(planetSeed);

                currentRadius += seededGen.nextRandomFloatFromRange(that.orbitDelta);
                planet.position.copy(seededGen.randomPointOnSphere(currentRadius));

                planets.push(planet);

            }

            var sunSeed = seededGen.nextRandomFloat();
            var sun = planetFactory.createStar(sunSeed);

            return new System(sun, planets);
        };

    }

    return SystemFactory;
});
