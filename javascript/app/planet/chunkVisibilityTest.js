define(["camera"], function(camera) {

    return {

        test: visibilityTest,

    };


    function visibilityTest(chunk, planetPosition, actualLevel) {

        var frontSideVisible = isFrontSideVisible(chunk, planetPosition, actualLevel);
        var inCameraFrustum = frontSideVisible && isInCameraFrustum(chunk);
        return frontSideVisible && inCameraFrustum;

    }

    function isFrontSideVisible(chunk, planetPosition, actualLevel) {

        var absolutePosition = chunk.relativePosition.clone().add(planetPosition);
        var dir = camera.position.clone().sub(absolutePosition).normalize();
        var dot = chunk.normal.dot(dir);

        var tolerance = 0.615 / Math.pow(2, actualLevel);

        var angle1 = Math.acos(dot) + tolerance;
        var angle2 = Math.acos(dot) - tolerance;

        return angle1 < Math.PI / 2 || angle2 < Math.PI / 2;

    }

    function isInCameraFrustum(chunk) {

        if (!chunk.mesh.boundingBox) {

            chunk.mesh.computeBoundingBox();

        }

        return camera.frustum.intersectsBox(chunk.mesh.boundingBox);

    }

});
