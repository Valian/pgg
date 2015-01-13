define(['seedrandom'], function(seedrandom) {

	function SeededRandom(seed) {
		this.seed = seed;
		this.random = seedrandom(this.seed.toString());
		this.nextRandomFloatFromRange = nextRandomFloatFromRange;
		this.nextRandomIntFromRange = nextRandomIntFromRange;
		this.randomArrayElement = randomArrayElement;
		this.nextRandomFloat = nextRandomFloat;
		this.repeatableRandomFloatFromRange = repeatableRandomFloatFromRange;
		
		function nextRandomFloatFromRange(from, to) {
			return this.random() * (to - from) + from;
		}

		function nextRandomIntFromRange(from, to) {
			return Math.floor(this.random() * (to - from) + from);
		}

		function repeatableRandomFloatFromRange(from, to, seed) {
			var repeatableRandom = seedrandom(this.seed.toString() + seed.toString());
			return repeatableRandom() * (to - from) + from;
		}

		function randomArrayElement(array) {
			return array[this.nextRandomIntFromRange(0, array.length)]
		}

		function nextRandomFloat() {
			return this.random();
		}
	}

	return SeededRandom;
});
