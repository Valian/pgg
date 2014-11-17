

var PLANET_DETAILS = {
	LOW: 1,
	MEDIUM: 2,
	HIGH: 3,
};


var Planet = function(geometry, material) {
	this.mesh = new THREE.Mesh(geometry, material);
};