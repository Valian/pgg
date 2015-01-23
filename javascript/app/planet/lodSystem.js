define([], function() {

    function LOD() {

        this.update = update;

        function update(chunk, planetPosition, maxLevel, mainCamera) {

            var actualLevel = chunk.level;
            var position = new THREE.Vector3();

            position.copy(planetPosition).add(chunk.positionOnSphere);
            var dist = mainCamera.perspectiveCamera.position.distanceTo(position);
            var desiredLevel = (maxLevel * chunk.size - dist) / chunk.size;

            if (desiredLevel > actualLevel && maxLevel > actualLevel) {

                chunk.split();

            }

            if (desiredLevel <= actualLevel - 0.5) {

                chunk.merge();

            }

        }

    }

    return LOD;
});
