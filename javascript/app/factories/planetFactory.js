define(['utils/seededRandom', 'planet/planetTypes', 'planet/planet', 'seedrandom', 'config'],
	function(SeededRandom, planetTypes, Planet, seedrandom, config) {

    var factoryConfig = config.config.planetFactory;

    return PlanetFactory;

	function PlanetFactory(factorySeed) {

        var that = this;

		this.factorySeed = factorySeed;
        this.planetCategory = factoryConfig.planetsCategoryName;
        this.starsCategory = factoryConfig.starsCategoryName;

		this.createPlanet = createPlanet;
        this.createStar = createStar;


        function createPlanet(seed) {

            var types = planetTypes[that.planetCategory];
            return createObject(seed, types);

	    }

        function createStar(seed) {

            var types = planetTypes[that.starsCategory];
            return createObject(seed, types);

        }

        function createObject(seed, arrayOfTypes) {

            var seededRandom = new SeededRandom(that.factorySeed + seed);
            var objectType = seededRandom.randomArrayElement(arrayOfTypes);
            var attributes = objectType.generateRandomAttributes(seededRandom);

            return new Planet(attributes);

        }

	}
});
