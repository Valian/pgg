define( function (require) {

    var THREE = require("three"),
        camera = require("camera"),
        faceMesh = require("planet/faceMesh"),
        visibilityTest = require("planet/chunkVisibilityTest"),
        LOD = require("planet/lodSystem"),
        heightmapManager = require("planet/heightmapManager");

    TerrainChunk.prototype = {

        constructor: TerrainChunk,
        split: split,
        merge: merge,
        update: update,
        setHeightmap: setHeightmap,
        generateHeightmap: generateHeightmap

    };

    return {

        create: function(planet, size, position, rotation, number) {

            return new TerrainChunk(planet, size, position, rotation, number);

        },

    };

    function TerrainChunk(planet, size, position, rotation, number) {

        this.size = size;
        this.chunks = [];
        this.planet = planet;
        this.material = planet.material.clone();
        this.visibleByCamera = true;
        this.isDivided = false;

        this.rotation = rotation;
        this.relativePosition = position.clone();
        this.normal = position.clone().normalize();
        this.positionOnSphere = this.normal.clone().multiplyScalar(planet.planetRadius);

        this.mesh = faceMesh.create(

            size, planet.planetType.chunkSegments,
            this.material,
            position,
            rotation,
            number,
            planet.planetRadius,
            planet.surfaceHeight

        );

        this.planet.add( this.mesh );

        this.heightmapParams = createHeightmapParams( this.mesh.corners );

        //autogenerate heightmap for 0 lvl
        if(number == -1) {

            this.setHeightmap(this.generateHeightmap());

        }

        function createHeightmapParams(corners) {

            var heightmapGen = planet.planetType.heightmapGenerator;

            return {

                generator: heightmapGen,
                corners: corners,
                seed: planet.seed * 1000,

            };

        }

    }

    function split() {

        if (this.isDivided) return;

        var heightmap = this.generateHeightmap();
        var segments = this.planet.planetType.chunkSegments;
        var position = this.relativePosition;

        for (var i = 0; i < this.mesh.corners.length; i++) {

            var newCenter = this.mesh.corners[i].clone();

            //calculate mid point
            newCenter.sub(position).divideScalar(2).add(position);

            var chunk = new TerrainChunk(

                this.planet,
                this.size / 2,
                newCenter,
                this.rotation,
                i

            );

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
        this.isDivided = false;

    }

    function generateHeightmap() {

        return heightmapManager.getTexture(
            this.heightmapParams
        );

    }

    function setHeightmap(heightmap) {

        this.material.uniforms.heightmapTex = {
            type: "t",
            value: heightmap
        };

    }

    function update(maxDetailLevel, actualLevel) {

        actualLevel = actualLevel || 0;

        LOD.update(this, actualLevel, maxDetailLevel);

        this.visibleByCamera = visibilityTest.test(this, actualLevel);
        this.mesh.visible = this.visibleByCamera && !this.isDivided;


        for (var i = 0; i < this.chunks.length; i++) {

            this.chunks[i].update(maxDetailLevel, actualLevel + 1);

        }

    }

});
