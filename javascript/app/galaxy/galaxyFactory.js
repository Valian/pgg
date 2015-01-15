define(['three', 'utils/seededRandom'], function(THREE, SeededRandom) {

    return GalaxyFactory;

    function GalaxyFactory(factorySeed) {

        this.factorySeed = factorySeed;
        this.createGalaxyCube = createGalaxyCube;

        function createGalaxyCube(galaxySeed, middle, size) {

            var seed = this.factorySeed.toString() + galaxySeed.toString() +
                       middle.x.toFixed(2) + middle.y.toFixed(2) + middle.z.toFixed(2);

            var seededRandom = new SeededRandom(seed);

            var systemArray = [];
            var size2 = size / 2;

            for(var x=middle.x - size2; x<middle.x + size2; x++) {

                for(var y=middle.y - size2; y<middle.y + size2; y++) {

                    for(var z=middle.z - size2; z<middle.z + size2; z++) {

                        systemArray[systemArray.length] = {

                            position: new THREE.Vector3(x,y,z),
                            angle: new THREE.Vector2(
                                seededRandom.nextRandomFloatFromRange(-90, 90),
                                seededRandom.nextRandomFloatFromRange(0, 360)
                            ),

                        };

                    }

                }

            }

            return systemArray;

        }

    }

});
