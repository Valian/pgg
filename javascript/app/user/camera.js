define(['three', 'utils/math'], function(THREE, MathUtils) {

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
			var lookAtVector = new THREE.Vector3(0, 0, -1);
			lookAtVector.applyQuaternion(this.perspectiveCamera.quaternion);
			var spherical = MathUtils.cartesianToSpherical(lookAtVector.x, lookAtVector.y, lookAtVector.z);
			return [spherical[1], spherical[2]];
		}
	}

	return Camera;
});
