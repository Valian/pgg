define( function (require) {

    var THREE = require("three"),
        FaceMesh = require("planet/faceMesh"),
        visibilityTest = require("planet/chunkVisibilityTest"),
        LOD = require("planet/lodSystem"),
        heightmapManager = require("heightmap/heightmapManager");

    TerrainChunk.prototype = {

        constructor: TerrainChunk,
        split: split,
        merge: merge,
        update: update,
        setHeightmap: setHeightmap,
        generateHeightmap: generateHeightmap,
        dispose: dispose

    };

    return TerrainChunk;

    function TerrainChunk(properties, size, position, rotation, number, level) {

        this.lod = new LOD();

        this.size = size;
        this.level = level;
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

        this.heightmapParams = createHeightmapParams( this.mesh.corners, this.level );

        //autogenerate heightmap for 0 lvl
        if(number == -1) {

            this.setHeightmap(this.generateHeightmap());

        }

        function createHeightmapParams(corners, level) {

            var heightmapGen = properties.heightmapGenerator;

            return {

                generator: heightmapGen,
                corners: corners,
                properties : properties,
                level: level

            };

        }

    }

    function split() {

        if (this.isDivided) return;

        //generate heightmap for created chunks
        var heightmap = this.generateHeightmap();
        var position = this.relativePosition;

        for (var i = 0; i < this.mesh.corners.length; i++) {

            var newCenter = this.mesh.corners[i].clone();

            //calculate mid point
            newCenter.sub(position).divideScalar(2).add(position);

            var chunk = new TerrainChunk(

                this.properties,    //properties of the planet
                this.size / 2,      //size is half of current size
                newCenter,          //calculated center
                this.rotation,      //same orientation in space
                i,                  //corner number for UV calculations
                this.level + 1      //recirsive level

            );

            //all created chunks use different chunks of generated heightmap
            chunk.setHeightmap(heightmap);

            this.chunks.push(chunk);
            this.mesh.parent.add(chunk.mesh);

        }

        this.isDivided = true;

    }

    function merge() {

        if (!this.isDivided) return;

        //dispose all child chunks
        for (var i = 0; i < this.chunks.length; i++) {

            this.chunks[i].dispose();

        }

        //mark current heightmap as unused, to be deleted in future
        heightmapManager.markAsUnused(this.heightmapParams);

        this.chunks = [];
        this.isDivided = false;

    }

    function dispose() {

        for (var i = 0; i < this.chunks.length; i++) {

            this.chunks[i].dispose();

        }

        heightmapManager.markAsUnused(this.heightmapParams);
        this.mesh.disposeMesh();

    }

    function generateHeightmap() {

        return heightmapManager.getTexture(

            this.heightmapParams

        );

    }

    function setHeightmap(data) {

        var uniforms = this.material.uniforms;
        uniforms.heightmapTex = { type: "t", value: data.heightmap };
        uniforms.bumpmapTex = { type: "t", value: data.bumpmap };

    }

    function update(camera, planet, maxDetailLevel) {

        this.lod.update(this, planet.position, maxDetailLevel, camera);

        this.visibleByCamera = visibilityTest(camera, this, planet.position);
        this.mesh.visible = this.visibleByCamera && !this.isDivided;


        for (var i = 0; i < this.chunks.length; i++) {

            this.chunks[i].update(camera, planet, maxDetailLevel);

        }

    }

});
