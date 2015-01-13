define(['utils/seededRandom'], function(SeededRandom) {

	function GalaxyFactory(factorySeed) {
		this.factorySeed = factorySeed;
		this.createGalaxyCube = createGalaxyCube;
		this.createSystemParameters = createSystemParameters;

		function createGalaxyCube(galaxySeed, middle, size) {
			var seededRandom = new SeededRandom(this.factorySeed.toString() + galaxySeed.toString());

			var systemArray = new Array(2 * size + 1);
			for(var x=0; x<systemArray.length; x++) {
				systemArray[x] = new Array(2 * size + 1);
				for(var y=0; y<systemArray[x].length; y++) {
					systemArray[x][y] = new Array(2 * size + 1);
					for(var z=0; z<systemArray[x][y].length; z++) {
						systemArray[x][y][z] = this.createSystemParameters(
							x + size - middle[0],
							y + size - middle[1],
							z + size - middle[2],
							galaxySeed,
							seededRandom
						)
					}
				}
			}

			return systemArray;
		}

		function createSystemParameters(x, y, z, galaxySeed, seededRandom) {
			return {
				x: seededRandom.repeatableRandomFloatFromRange(
					-0.5, 0.5, "" + x + y + z + galaxySeed + "x"),
				y: seededRandom.repeatableRandomFloatFromRange(
					-0.5, 0.5, "" + x + y + z + galaxySeed + "y"),
				z: seededRandom.repeatableRandomFloatFromRange(
					-0.5, 0.5, "" + x + y + z + galaxySeed + "z"),
				seed: seededRandom.repeatableRandomFloatFromRange(
					-0.5, 0.5, "" + x + y + z + galaxySeed + "seed"),
			}
		}
	}

	return GalaxyFactory;
});