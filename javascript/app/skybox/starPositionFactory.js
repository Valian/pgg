define(['three', 'utils/seededRandom', 'config'], function(THREE, SeededRandom, config) {

    function StarPositionFactory(size, seed) {
        var that = this;

        this.size = size;
        this.seed = seed;

        this.generateStarPositions = generateStarPositions;

        function generateStarPositions(x, y, z) {
            var seededRandom = new SeededRandom(that.seed + x.toFixed +
                y.toFixed + z.toFixed);
            var data = [];

            for(var x = -that.size / 2; x < that.size / 2; x++) {
                for(var y = -that.size / 2; y < that.size / 2; y++) {
                    for(var z = -that.size / 2; z < that.size / 2; z++) {

                        data.push({
                            position: new THREE.Vector3(x, y, z).add(new THREE.Vector3(x, y, z)),
                            theta: Math.acos(2 * seededRandom.nextRandomFloat() - 1),
                            phi: 2 * Math.PI * seededRandom.nextRandomFloat(),
                            size: seededRandom.nextRandomFloatFromRange(
                                config.config.skybox.starSizeInRadians.min,
                                config.config.skybox.starSizeInRadians.max
                            )
                        })

                    }
                }
            }

            return data;
        }

    }

    return StarPositionFactory;
});
