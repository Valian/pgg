define(['three', 'utils/keyCodes'], function(THREE, KEY_CODES) {

	function FpsControls(camera) {
		var that = this;

		this.controlsObject = new THREE.FlyControls(camera);
		this.update = update;
		this.init = init;


        this.controlsObject.rollSpeed = 0.5;
        this.controlsObject.movementSpeed = 5000;

		function update(deltaTime) {
			this.controlsObject.update(deltaTime);
		}

		function init(system) {

		}
	}

	return FpsControls;
});
