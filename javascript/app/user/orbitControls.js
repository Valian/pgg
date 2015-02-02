define(['three', 'utils/keyCodes'], function(THREE, KEY_CODES) {

	function OrbitControls(app, camera) {
		var that = this;

		this.app = app;
		this.camera = camera;
		this.controlsObject = new THREE.OrbitControls(camera);
		this.system = null;
		this.currentPlanet = 0;
		this.update = update;
		this.init = init;

		window.addEventListener('keydown', changePlanetOnKeyDown);
		window.addEventListener('keydown', disableOrbitControlsOnLeftCtrlDown);
		window.addEventListener('keyup', enableOrbitControlsOnLeftCtrlUp);
		window.addEventListener('click', changeSystemOnClick);
		this.controlsObject.noPan = true;

		function init(system) {
			that.system = system;
			var sun = that.system.sun;
            changeOrbitTarget(sun, sun.planetRadius * 5);
		}

		function update(deltaTime) {
			this.controlsObject.update(deltaTime);
		}

		function changePlanetOnKeyDown(e) {

            var prevPlanetNumber = that.currentPlanet;

			if(that.system) {
				switch(e.keyCode) {
					case KEY_CODES.LEFT_ARROW:
						that.currentPlanet -= 1;
						if(that.currentPlanet == -1) {
							that.currentPlanet = that.system.planets.length - 1;
						}
						break;
					case KEY_CODES.RIGHT_ARROW:
						that.currentPlanet = (that.currentPlanet + 1) % that.system.planets.length;
						break;
				}

			}

            if(prevPlanetNumber !== that.currentPlanet) {

                var planet = that.system.planets[that.currentPlanet];
                changeOrbitTarget(planet, planet.planetRadius * 5);

            }
		}

        function changeOrbitTarget(target, distance) {

            that.controlsObject.target = target.position.clone();
            that.camera.position.copy(target.position);
            that.camera.position.z -= distance;

        }

		function disableOrbitControlsOnLeftCtrlDown(e) {
			if(e.keyCode == KEY_CODES.CTRL) {
				that.controlsObject.enabled = false;
			}
		}

		function enableOrbitControlsOnLeftCtrlUp(e) {
			if(e.keyCode == KEY_CODES.CTRL) {
				that.controlsObject.enabled = true;
			}
		}

		function changeSystemOnClick(e) {
			if(!that.controlsObject.enabled) {
                debugger;
				that.app.switchSystem(
					Math.floor(200 * Math.random()),
					Math.floor(200 * Math.random()),
					Math.floor(200 * Math.random())
				);
			}
		}
	}

	return OrbitControls;
});
