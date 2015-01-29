define(['config'], function(config) {

	function GalaxyCube(middle, size) {

		this.middle = middle;
		this.size = size;
		this.systemSlots = new Array(2 * this.size + 1);

		for(var x=0; x<this.systemSlots.length; x++) {

			this.systemSlots[x] = new Array(2 * this.size + 1);

			for(var y=0; y<this.systemSlots[x].length; y++) {

				this.systemSlots[x][y] = new Array(2 * this.size + 1);

				for(var z=0; z<this.systemSlots[x][y].length; z++) {
					this.systemSlots[x][y][z] = {

					};
				}
			}
		}

		this.get = function(x, y, z) {
			return this.systemSlots[x + this.size - this.middleIndices[0]][y + this.size - this.middleIndices[1]][z + this.size - this.middleIndices[2]];
		}

		this.set = function(x, y, z, value) {
			this.systemSlots[x + this.size - this.middleIndices[0]][y + this.size - this.middleIndices[1]][z + this.size - this.middleIndices[2]] = value;
		}
	}

	return GalaxyCube;
});
