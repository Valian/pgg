define(['three', 'user/fpsControls', 'user/orbitControls', 'utils/keyCodes'],
	function(THREE, FpsControls, OrbitControls, KEY_CODES) {

	function Controls(camera) {
		var that = this;

		this.camera = camera;
		this.controlsArray = [new OrbitControls(camera), new FpsControls(camera)];
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
			this.controlsArray[this.currentControls].init(this.currentSystem);
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
