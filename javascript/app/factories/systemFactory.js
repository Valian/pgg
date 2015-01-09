define(['utils/seededRandom'], function(SeededRandom) {

	function SystemFactory(factorySeed) {
		this.factorySeed = factorySeed;

		this.createSystem = function(systemSeed) {
			var seededRandom = SeededRandom.new(factorySeed + systemSeed);
		};
	}

	return {
		new: function(seed) { return new SystemFactory(seed); }
	};
});