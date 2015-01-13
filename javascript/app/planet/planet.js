define(["three", "planet/terrainChunk"], function(THREE, TerrainChunk) {

    Planet.prototype = Object.create(THREE.Object3D.prototype);

    function Planet(planetProperties) {

        THREE.Object3D.call(this);

        this.planetRadius = planetProperties.planetRadius;
        this.planetSurface = planetProperties.planetSurface;
        this.seed = planetProperties.seed;
        this.lodMaxDetailLevel = planetProperties.lodMaxDetailLevel;

        this.properties = planetProperties;

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

            var size = (planet.planetRadius + planet.planetSurface / 2)
                        * (2 / Math.sqrt(3));

            var chunk = new TerrainChunk(

                planet.properties,
                size,
                position.multiplyScalar(size / 2),
                rotation,
                -1

            );

            planet.add(chunk.mesh);

            return chunk;

        }

        function update() {

            for (key in this.chunks) {

                this.chunks[key].update(this, this.lodMaxDetailLevel);

            }

        }

    };

    return Planet;
});
