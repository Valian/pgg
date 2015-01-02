define(["camera"], function(camera) {

    return {

        test: visibilityTest,

    };


    function visibilityTest(chunk, actualLevel) {

        var frontSideVisible = isFrontSideVisible(chunk, actualLevel);
        var inCameraFrustum = isInCameraFrustum(chunk);
        return frontSideVisible && inCameraFrustum;

    }

    function isFrontSideVisible(chunk, actualLevel) {

        var absolutePosition = chunk.relativePosition.clone().add(chunk.planet.position);
        var dir = camera.position.clone().sub(absolutePosition).normalize();
        var dot = chunk.normal.dot(dir);

        var tolerance = 0.615 / Math.pow(2, actualLevel);

        var angle1 = Math.acos(dot) + tolerance;
        var angle2 = Math.acos(dot) - tolerance;

        return angle1 < Math.PI / 2 || angle2 < Math.PI / 2;

    }

    function isInCameraFrustum(chunk) {

        if (!chunk.mesh.boundingBox) {

            chunk.mesh.computeBoundingBox(chunk.planet.planetRadius);

        }

        return camera.frustum.intersectsBox(chunk.mesh.boundingBox);

    }

});
