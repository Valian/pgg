define(['three'], function(THREE) {

	function Controls(camera) {
		var that = this;

		this.orbitControls = new THREE.OrbitControls(camera);
		this.orbitControls.damping = 0.2;
		this.system = null;
		this.currentPlanet = 0;
		this.update = update;
		this.setSystem = setSystem;
		init();

		function init() {
			window.addEventListener('keydown', changePlanetOnKeyDown);
			that.orbitControls.noPan = true;
		}

		function setSystem(system) {
			this.system = system;
			this.orbitControls.target = this.system.planets[0].position.clone();
		}

		function update(deltaTime) {
			this.orbitControls.update(deltaTime);
		}

		function changePlanetOnKeyDown(e) {
			if(that.system) {
				switch(e.keyCode) {
					case 37:
						that.currentPlanet -= 1;
						if(that.currentPlanet == -1) {
							that.currentPlanet = that.system.planets.length - 1;
						}
						break;
					case 39:
						that.currentPlanet = (that.currentPlanet + 1) % that.system.planets.length;
						break;
				}
				that.orbitControls.target = that.system.planets[that.currentPlanet].position.clone();
			}
		}
	}

	return Controls;
});
