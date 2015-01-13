define(["three"], function(THREE) {

    var data = {};

    return {

        getPlaneGeometry: getPlaneGeometry

    };

    function getPlaneGeometry(size, segments) {

        var name = toPlaneName(size, segments);

        if(!data[name]) {

            data[name] = new THREE.PlaneBufferGeometry(

                size,
                size,
                segments,
                segments

            );

        }

        return data[name].clone();

    }

    function toPlaneName(size, segments) {

        return "size" + size + "seg" + segments;

    }

});
