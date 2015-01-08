define(['three'], function(THREE) {

	function PlanetContainer() {
		this.planets = new THREE.Object3D();
		this.addPlanet = addPlanet;
		this.updateAll = updateAll;

		function addPlanet(planet) {
			this.planets.add(planet);
		};

		function updateAll() {
			for(var i=0; i<this.planets.children.length; i++) {
				this.planets.children[i].update();
			}
		};
	}

	return PlanetContainer;
});