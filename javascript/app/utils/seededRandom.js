define(['seedrandom'], function(seedrandom) {

	function SeededRandom(seed) {

		this.random = seedrandom(seed.toString());

		this.nextRandomFloatFromRange = function(from, to) {
			return this.random() * (to - from) + from;
		}

		this.nextRandomIntFromRange = function(from, to) {
			return Math.floor(this.random() * (to - from) + from);
		};

		this.randomArrayElement = function(array) {
			return array[this.nextRandomIntFromRange(0, array.length)]
		};
	}

	return {
		new: function(seed) { return new SeededRandom(seed); }
	};
});
