define([], function() {

    function visibilityTest(mainCamera, chunk, planetPosition, actualLevel) {
        return isFrontSideVisible(mainCamera, chunk, planetPosition, actualLevel) &&
            isInCameraFrustum(mainCamera, chunk);
    }

    function isFrontSideVisible(mainCamera, chunk, planetPosition, actualLevel) {

        var absolutePosition = chunk.relativePosition.clone().add(planetPosition);
        var dir = mainCamera.perspectiveCamera.position.clone().sub(absolutePosition).normalize();
        var dot = chunk.normal.dot(dir);

        var tolerance = 0.615 / Math.pow(2, actualLevel);

        var angle1 = Math.acos(dot) + tolerance;
        var angle2 = Math.acos(dot) - tolerance;

        return angle1 < Math.PI / 2 || angle2 < Math.PI / 2;

    }

    function isInCameraFrustum(mainCamera, chunk) {

        if (!chunk.mesh.boundingBox) {

            chunk.mesh.computeBoundingBox();

        }

        return mainCamera.frustum.intersectsBox(chunk.mesh.boundingBox);

    }

    return visibilityTest;
});
