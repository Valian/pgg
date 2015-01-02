define(["three", "planet/terrainChunk"], function(THREE, terrainChunk) {

    Planet.prototype = Object.create(THREE.Object3D.prototype);

    return {

        create: function(material, planetRadius, surfaceHeight, planetType, seed) {

            return new Planet(material, planetRadius, surfaceHeight, planetType, seed);

        }

    };

    function Planet(material, planetRadius, surfaceHeight, planetType, seed) {

        THREE.Object3D.call(this);

        this.planetRadius = planetRadius;
        this.surfaceHeight = surfaceHeight;
        this.material = material;
        this.seed = seed;

        this.planetType = planetType;

        this.frustumCulled = false;

        this.update = update;

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
            var chunk = terrainChunk.create(planet, size,
                position.multiplyScalar(size / 2), rotation, -1);

            planet.add(chunk.mesh);

            return chunk;

        }

        function update() {

            for (key in this.chunks) {

                this.chunks[key].update(this.planetType.lodMaxDetailLevel);

            }

        }

    };

});
