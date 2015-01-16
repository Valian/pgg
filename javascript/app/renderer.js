define(["three"], function(THREE) {

    var renderer = new THREE.WebGLRenderer({
        antialias: false,
        premultipliedAplha: true
    });
    renderer.sortObjects = false;
    //renderer.setFaceCulling(false);
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    return renderer;

});
