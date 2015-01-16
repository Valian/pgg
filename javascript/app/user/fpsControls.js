define(['three', 'utils/keyCodes'], function(THREE, KEY_CODES) {

	function FpsControls(camera) {
		var that = this;

		this.controlsObject = new THREE.FlyControls(camera);
		this.update = update;
		this.init = init;

		function update(deltaTime) {
			this.controlsObject.update(deltaTime);
		}

		function init(system) {

		}
	}

	return FpsControls;
});
