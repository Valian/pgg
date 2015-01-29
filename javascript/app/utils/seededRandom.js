define(['seedrandom', 'utils/math'],
       function(seedrandom, MathUtils) {

    function SeededRandom(seed) {

        this.seed = seed;
        this.random = seedrandom(this.seed.toString());

    }

    SeededRandom.prototype = {

        constructor: SeededRandom,

        nextRandomFloatFromRange: function(from, to) {

            if(from.min && from.max) {

                to = from.max;
                from = from.min;

            }

            return this.random() * (to - from) + from;

        },

        nextRandomIntFromRange: function(from, to) {

            if(from.min && from.max) {

                to = from.max;
                from = from.min;

            }

            return Math.floor(this.random() * (to - from) + from);

        },

        randomArrayElement: function(array) {

            return array[this.nextRandomIntFromRange(0, array.length)];

        },

        nextRandomFloat: function() {

            return this.random();

        },

        randomPointOnSphere: function(radius) {

            var theta = Math.acos(2 * this.nextRandomFloat() - 1);
            var phi = 2 * Math.PI * this.nextRandomFloat();

            return MathUtils.sphericalToCartesian(radius, theta, phi);

        }

    }

    return SeededRandom;

});
