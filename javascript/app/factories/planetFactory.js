define(['utils/seededRandom', 'planet/planetTypes', 'planet/planet', 'seedrandom'],
	function(SeededRandom, planetTypes, Planet, seedrandom) {

	function PlanetFactory(factorySeed) {
		this.factorySeed = factorySeed;
		this.createPlanet = createPlanet;
		this.generateRandomPlanetAttributes = generateRandomPlanetAttributes;

	    function createPlanet(seed) {
	    	var seededRandom = new SeededRandom(this.factorySeed + seed);

	        var planetType = seededRandom.randomArrayElement(planetTypes);
	        var attributes = planetType.generateRandomAttributes(seededRandom);
            attributes.seed = seed;

	        return new Planet(attributes);

	    }

	    function generateRandomPlanetAttributes(planetType, seededRandom) {

	        var attributes = {

	            planetRadius: seededRandom.nextRandomFloatFromRange(

                    planetType.planetRadius.min,
	            	planetType.planetRadius.max

                ),
	            planetSurface: seededRandom.nextRandomFloatFromRange(

                    planetType.planetSurface.min,
	            	planetType.planetSurface.max

                ),
                multipliers: generateRandomMultipliers(

                    seededRandom,
                    planetType.noiseMultipliers

                ),
	            material: planetType.material.clone()

	        };

	        return attributes;

	    }

        function generateRandomMultipliers(seededRandom, multipliers) {

            var generated = [];

            for(var i=0; i < multipliers.length; i++) {

                generated.push({

                    weight: multipliers[i].weight,
                    frequency: seededRandom.nextRandomFloatFromRange(
                        multipliers[i].frequency.min,
                        multipliers[i].frequency.max
                    )

                })

            }

            return generated;

        }
	}

	return PlanetFactory;
});
