define(["camera"], function(camera) {

    var position = new THREE.Vector3();

    return {

        update: updateLOD,

    }

    function updateLOD(chunk, actualLevel, maxLevel) {

        position.copy(chunk.planet.position).add(chunk.positionOnSphere);
        var dist = camera.position.distanceTo(position);
        var desiredLevel = (maxLevel * chunk.size - dist) / chunk.size;

        //TODO - add merge and split calls
        if (desiredLevel > actualLevel && maxLevel > actualLevel) {

            chunk.split();

        }

        if (desiredLevel <= actualLevel - 0.5) {

            chunk.merge();

        }
    }

});
