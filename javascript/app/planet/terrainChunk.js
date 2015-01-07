define( function (require) {

    var THREE = require("three"),
        camera = require("camera"),
        faceMesh = require("planet/faceMesh"),
        visibilityTest = require("planet/chunkVisibilityTest"),
        LOD = require("planet/lodSystem"),
        heightmapManager = require("planet/heightmapManager");

    TerrainChunk.prototype.split = split;
    TerrainChunk.prototype.merge = merge;
    TerrainChunk.prototype.update = update;
    TerrainChunk.prototype.generateHeightmap = generateHeightmap;
    TerrainChunk.prototype.setHeightmap = setHeightmap;
    TerrainChunk.prototype.createHeightmapParams = createHeightmapParams;


    return {

        create: function(planet, size, position, rotation, number) {

            return new TerrainChunk(planet, size, position, rotation, number);

        },

    };

    function TerrainChunk(planet, size, position, rotation, number) {

        this.chunks = [];
        this.planet = planet;
        this.material = planet.material.clone();

        this.rotation = rotation;
        this.relativePosition = position.clone();
        this.normal = position.clone().normalize();
        this.positionOnSphere = this.normal.clone()
                                .multiplyScalar(this.planet.planetRadius);

        this.size = size;

        this.mesh = faceMesh.create(size, planet.planetType.chunkSegments,
                                    this.material, position, rotation,
                                    number, planet.planetRadius, planet.surfaceHeight);

        this.planet.add(this.mesh);

        this.corners = createCorners(this.mesh.geometry,
                                     planet.planetType.chunkSegments);

        this.heightmapParams = this.createHeightmapParams();

        this.visibleByCamera = true;
        this.isDivided = false;

        //autogenerate heightmap for 0 lvl
        if(number == -1) {

            this.setHeightmap(this.generateHeightmap());

        }

        function createCorners(geometry, segments) {

            var vert = geometry.attributes.position.array;
            var vLen = vert.length;

            return [
                new THREE.Vector3(vert[0], vert[1], vert[2]),
                new THREE.Vector3(vert[3 * segments], vert[3 * segments + 1], vert[3 * segments + 2]),
                new THREE.Vector3(vert[vLen - 3 * segments - 3], vert[vLen - 3 * segments - 2], vert[vLen - 3 * segments - 1]),
                new THREE.Vector3(vert[vLen - 3], vert[vLen - 2], vert[vLen - 1])
            ];

        }

    }

    function generateHeightmap() {

        return heightmapManager.getTexture(this.heightmapParams);

    }

    function setHeightmap(heightmap) {

        this.material.uniforms.heightmapTex = {
            type: "t",
            value: heightmap
        };

    }

    function createHeightmapParams() {

        var heightmapGen = this.planet.planetType.heightmapGenerator;

        return {

            generator: heightmapGen,
            corners: this.corners,
            //leftTop: this.corners[0],
            //leftBottom: this.corners[2],
            //rightTop: this.corners[1],
            seed: this.planet.seed * 1000,

        };

    }

    function split() {

         if (this.isDivided) return;

         var segments = this.planet.planetType.chunkSegments;
         var position = this.relativePosition;
         var size = this.size;
         var material = this.material;

         var heightmap = this.generateHeightmap();

         for (var key in this.corners) {

             var newCenter = this.corners[key].clone().sub(position)
                             .divideScalar(2).add(position);

             var chunk = new TerrainChunk(this.planet, size / 2,
                                          newCenter, this.rotation, key);

             chunk.setHeightmap(heightmap);

             this.chunks.push(chunk);
             this.planet.add(chunk.mesh);

         }

         this.isDivided = true;

    }

    function merge() {

        if (!this.isDivided) return;

        for (var i = 0; i < this.chunks.length; i++) {

            var chunk = this.chunks[i];

            chunk.merge();

            chunk.mesh.disposeMesh();

        }

        heightmapManager.markAsUnused(this.heightmapParams);
        this.chunks = [];
        this.mesh.visible = true;
        this.isDivided = false;

    }

    function update(maxDetailLevel, actualLevel) {

        actualLevel = actualLevel || 0;

        LOD.update(this, actualLevel, maxDetailLevel);
        this.visibleByCamera = visibilityTest.test(this, actualLevel);

        this.mesh.visible = this.visibleByCamera && !this.isDivided;

        for (var i = 0; i < this.chunks.length; i++) {

            this.chunks[i].update(maxDetailLevel, actualLevel + 1);

        }

        //backface culling
        //this.visibleByCamera = isFrontSideVisible(chunkPosition, this.normal, camera, actualLevel);
        //frustum culling
        //this.visibleByCamera = this.visibleByCamera && isInCameraFrustum(camera, this);

        //if (desiredLevel > actualLevel && maxDetailLevel > actualLevel && this.visibleByCamera) {

        //    this.split();

        //}

        //if (desiredLevel <= actualLevel - 0.5) {

        //    this.merge();

        //}

    }

});
