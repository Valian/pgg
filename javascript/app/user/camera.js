define(['three'], function(THREE) {

	function Camera() {
		this.perspectiveCamera = new THREE.PerspectiveCamera(
			35, window.innerWidth / window.innerHeight, 50, 10000000);
		this.frustum = new THREE.Frustum();
		this.updateFrustum = updateFrustum;
		this.getAngles = getAngles;

		function updateFrustum() {
			var matrix = new THREE.Matrix4();
			matrix.multiplyMatrices(this.perspectiveCamera.projectionMatrix,
				this.perspectiveCamera.matrixWorldInverse);
			this.frustum.setFromMatrix(matrix);
		}

		function getAngles() {

		}
	}

	return Camera;
});
