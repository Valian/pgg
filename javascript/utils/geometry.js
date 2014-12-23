

var GeometryUtils = {
	createNormalPlaneGeometry: function() {
		var planeGeometry = new THREE.Geometry();

		planeGeometry.vertices.push(new THREE.Vector3(0, 1, 0));
		planeGeometry.vertices.push(new THREE.Vector3(1, 1, 0));
		planeGeometry.vertices.push(new THREE.Vector3(1, 0, 0));
		planeGeometry.vertices.push(new THREE.Vector3(0, 0, 0));

		planeGeometry.faces.push(new THREE.Face3(0, 1, 2));
		planeGeometry.faces.push(new THREE.Face3(0, 2, 3));

		return planeGeometry;
	}
};