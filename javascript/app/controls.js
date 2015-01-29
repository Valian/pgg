define( ["three", "camera"], function (THREE, camera) {

    var controls = new THREE.FlyControls(camera);
    controls.movementSpeed = 10000;
    controls.domElement = document;
    controls.rollSpeed = Math.PI / 24;
    controls.autoForward = false;
    controls.dragToLook = false;

    return controls;

});
