define(["three"], function (THREE) {

    var camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 50, 10000000);

    camera.frustum = new THREE.Frustum();
    camera.updateFrustum = update;

    return camera;

    function update() {

        var matrix = new THREE.Matrix4();

        matrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);

        this.frustum.setFromMatrix(matrix);

    }

});
