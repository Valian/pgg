define(["three", "scene", "planet/planetTypes", "seedrandom", "planet/planet", "config"],
       function(THREE, scene, planetTypes, seedrandom, planet, config) {

    var planets = [];
    var container = new THREE.Object3D();
    scene.add(container);


    return {

        planets: planets,
        generatePlanets: generatePlanets,
        createPlanet: createPlanet,
        update: update

    }


    function generatePlanets(seed) {

        var randomGen = seedrandom(seed || "test");

        var newPlanet = this.createPlanet(randomGen().toString());
        newPlanet.position.z -= 60000;
        newPlanet.position.x += 20000 ;

    }

    //tworzy planete wybranego typu.
    //Dostepne typy sa zawarte w obiekcie planetTypes
    function createPlanet(seed) {

        var randomGen = seedrandom(seed.toString());
        var planetType = getRandomPlanetType(randomGen);
        var attributes = generateRandomPlanetAttributes(planetType, randomGen);

        var newPlanet = planet.create(attributes.material, attributes.planetRadius,
                                attributes.planetSurface, planetType, randomGen());

        this.planets.push(newPlanet);
        container.add(newPlanet);

        return newPlanet;

    }

    function getRandomPlanetType(randomGen) {

        var randomPlanetIndex = Math.floor(randomGen() * planetTypes.length);
        var planetType = planetTypes[randomPlanetIndex];

        return planetType;

    }

    function generateRandomPlanetAttributes(planetType, randomGen) {

        attributes = {

            planetRadius: getRandom(planetType.planetRadius.min, planetType.planetRadius.max),
            planetSurface: getRandom(planetType.planetSurface.min, planetType.planetSurface.max),
            material: planetType.material.clone(),

        };

        attributes.material.uniforms.planetRadius = { type: "f", value: attributes.planetRadius };
        attributes.material.uniforms.planetSurface = { type: "f", value: attributes.planetSurface };

        return attributes;

        function getRandom(min, max) {
            return randomGen() * (max - min) + min;
        }

    }


    //odswieza planety
    function update() {

        for (var name in this.planets) {

            this.planets[name].update();

        }

    }

});
