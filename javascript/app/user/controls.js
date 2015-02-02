define(['three', 'user/fpsControls', 'user/orbitControls', 'utils/keyCodes'],
	function(THREE, FpsControls, OrbitControls, KEY_CODES) {

	function Controls(camera, app) {
		var that = this;

		this.camera = camera;
		this.app = app
		this.controlsArray = [new OrbitControls(this.app, camera), new FpsControls(camera)];
		this.currentControls = 0;
		this.currentSystem = null;
		this.setCurrentSystem = setCurrentSystem;
		this.update = update;

		window.addEventListener('keydown', toggleControls);
		for(var i=0; i<that.controlsArray.length; i++) {
			this.controlsArray[i].enabled = false;
		}
		this.controlsArray[this.currentControls].enabled = true;

		function setCurrentSystem(system) {
            this.currentSystem = system;

            for(var i = 0; i < that.controlsArray.length; i++) {

                this.controlsArray[i].init(this.currentSystem);

            }
		}

		function update(deltaTime) {
			this.controlsArray[this.currentControls].update(deltaTime);
		}

		function toggleControls(e) {
			if(e.keyCode == KEY_CODES.SPACE) {
				that.controlsArray[that.currentControls].controlsObject.enabled = false;
				that.currentControls = (that.currentControls + 1) % that.controlsArray.length;
				that.controlsArray[that.currentControls].controlsObject.enabled = true;
			}
		}
	}

	return Controls;
});
