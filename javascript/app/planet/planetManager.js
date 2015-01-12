define(["three", "planet/planetTypes", "seedrandom", "planet/planet",
    "config", 'containers/planetContainer', 'factories/planetFactory'],
       function(THREE, planetTypes, seedrandom, planet, config, PlanetContainer, PlanetFactory) {


    var planetContainer = new PlanetContainer();

    return {
        generatePlanets: generatePlanets,
        update: update,
        planetContainer: planetContainer
    }

    function generatePlanets(seed) {

        var planetFactory = new PlanetFactory();

        var randomGen = seedrandom(123);

        var newPlanet = planetFactory.createPlanet(randomGen().toString());
        newPlanet.position.z -= 60000;
        newPlanet.position.x += 20000;

        planetContainer.addPlanet(newPlanet);
    }

    function update() {
        planetContainer.updateAll();
    }
});
