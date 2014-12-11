function Planet(material, planetRadius, surfaceHeight) {

    THREE.Object3D.call(this);

    this.planetRadius = planetRadius;
    this.surfaceHeight = surfaceHeight;

    this.material = material;
    this.maxDetailLevel = 5;
    this.segments = 10;

    this.frustumCulled = false;

    this.chunks = {
        right: createChunk(this, new THREE.Vector3(1, 0, 0), new THREE.Euler(0, 1.570796, 0)),
        left: createChunk(this, new THREE.Vector3(-1, 0, 0), new THREE.Euler(0, -1.570796, 0)),
        top: createChunk(this, new THREE.Vector3(0, 1, 0), new THREE.Euler(-1.570796, 0, 0)),
        bottom: createChunk(this, new THREE.Vector3(0, -1, 0), new THREE.Euler(1.570796, 0, 0)),
        front: createChunk(this, new THREE.Vector3(0, 0, 1), new THREE.Euler(0, 0, 0)),
        back: createChunk(this, new THREE.Vector3(0, 0, -1), new THREE.Euler(2 * 1.570796, 0, 0)),
    };

    function createChunk(planet, position, rotation) {

        var size = (planet.planetRadius + planet.surfaceHeight / 2) * (2 / Math.sqrt(3));
        var chunk = new TerrainChunk(size, planet.segments, material,
            position.multiplyScalar(size / 2), rotation, planet);

        planet.add(chunk.mesh);
        return chunk;

    }

    this.update = function(camera) {

        if (this.material.update) {

            this.material.update();

        }

        for (key in this.chunks) {

            this.chunks[key].update(camera, this.maxDetailLevel);

        }

    }

};

Planet.prototype = Object.create(THREE.Object3D.prototype);
