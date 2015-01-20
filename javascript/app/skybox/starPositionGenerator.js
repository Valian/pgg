define(['three', 'utils/seededRandom', 'config'],
       function(THREE, SeededRandom, config) {

    return StarPositionGenerator;

    function StarPositionGenerator(size, seed) {

        var that = this;

        this.size = size;
        this.seed = seed;

        this.generate = generate;

        function generate(middlePos) {

            var seed = that.seed + middlePos.x.toFixed + middlePos.y.toFixed + middlePos.z.toFixed;
            var gen = new SeededRandom(seed);
            var data = [];
            var starSize = config.config.skybox.starSizeInRadians;

            for(var x = -that.size / 2; x < that.size / 2; x++) {

                for(var y = -that.size / 2; y < that.size / 2; y++) {

                    for(var z = -that.size / 2; z < that.size / 2; z++) {

                        data.push({

                            position: new THREE.Vector3(x,y,z).add(middlePos),
                            theta: 2 * Math.PI * gen.nextRandomFloat(),
                            phi: Math.acos(2 * gen.nextRandomFloat() - 1),
                            size: gen.nextRandomFloatFromRange(starSize.min, starSize.max)

                        })

                    }

                }

            }

            return data;

        }

    }

});
