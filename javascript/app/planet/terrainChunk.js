define( function (require) {

    var THREE = require("three"),
        camera = require("camera"),
        FaceMesh = require("planet/faceMesh"),
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

    return TerrainChunk;

    function TerrainChunk(properties, size, position, rotation, number) {

        this.size = size;
        this.properties = properties;
        this.material = properties.material.clone();
        this.visibleByCamera = true;
        this.isDivided = false;

        this.chunks = [];
        this.chunkSegments = properties.chunkSegments;

        this.rotation = rotation;
        this.relativePosition = position.clone();
        this.normal = position.clone().normalize();
        this.positionOnSphere = this.normal.clone().multiplyScalar(properties.planetRadius);

        this.mesh = new FaceMesh(

            size,
            this.material,
            position,
            rotation,
            number,
            properties

        );

        this.heightmapParams = createHeightmapParams( this.mesh.corners );

        //autogenerate heightmap for 0 lvl
        if(number == -1) {

            this.setHeightmap(this.generateHeightmap());

        }

        function createHeightmapParams(corners) {

            var heightmapGen = properties.heightmapGenerator;

            return {

                generator: heightmapGen,
                corners: corners,
                properties : properties

            };

        }

    }

    function split() {

        if (this.isDivided) return;

        var heightmap = this.generateHeightmap();
        var position = this.relativePosition;

        for (var i = 0; i < this.mesh.corners.length; i++) {

            var newCenter = this.mesh.corners[i].clone();

            //calculate mid point
            newCenter.sub(position).divideScalar(2).add(position);

            var chunk = new TerrainChunk(

                this.properties,
                this.size / 2,
                newCenter,
                this.rotation,
                i

            );

            chunk.setHeightmap(heightmap);

            this.chunks.push(chunk);
            this.mesh.parent.add(chunk.mesh);

        }

        this.isDivided = true;

    }

    function merge() {

        if (!this.isDivided) return;

        for (var i = 0; i < this.chunks.length; i++) {

            this.chunks[i].merge();
            this.chunks[i].mesh.disposeMesh();

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

    function update(planet, maxDetailLevel, actualLevel) {

        actualLevel = actualLevel || 0;

        LOD.update(this, planet.position, actualLevel, maxDetailLevel);

        this.visibleByCamera = visibilityTest.test(this, planet.position, actualLevel);
        this.mesh.visible = this.visibleByCamera && !this.isDivided;


        for (var i = 0; i < this.chunks.length; i++) {

            this.chunks[i].update(planet, maxDetailLevel, actualLevel + 1);

        }

    }

});
