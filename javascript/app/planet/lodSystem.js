define(["camera"], function(camera) {

    return {

        update: updateLOD,

    }

    function updateLOD(chunk, actualLevel, maxLevel) {

        var dist = camera.position.distanceTo(chunk.positionOnSphere);
        var desiredLevel = (maxLevel * chunk.size - dist) / chunk.size;

        //TODO - add merge and split calls
        //if (desiredLevel > actualLevel && maxLevel > actualLevel) {

        //    chunk.split();

        //}

        //if (desiredLevel <= actualLevel - 0.5) {

        //    chunk.merge();

        //}
    }

});
