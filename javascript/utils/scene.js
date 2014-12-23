

var SceneUtils = {
	createSinglePlaneSceneObjects: function() {
		var scene = new THREE.Scene();

		var camera = new THREE.OrthographicCamera(0, 1, 0, 1, 1, 1000);
		camera.position.set(0, 0, 1);
		camera.lookAt(scene.position);
		scene.add(camera);

		var geometry = GeometryUtils.createNormalPlaneGeometry();
		var mesh = new THREE.Mesh(geometry, null);
		scene.add(mesh);

		return {scene: scene, camera: camera, mesh: mesh};
	}
};
