define(["three", "renderer", "resources", "config", "heightmap/firstPass", "heightmap/secondPass", "heightmap/bumpmapPass"],
       function(THREE, renderer, resources, config, FirstPass, SecondPass, BumpmapPass) {

    return HeightmapGenerator;

    HeightmapGenerator.pathToConfig = "config.config.costam";
    function HeightmapGenerator(size, properties) {

        this.name = properties.name;
        this.size = size;
        this.paralell = config.config.heightmapGenerator.generatorParallelity;
        this.octaves = properties.noiseMultipliers ? properties.noiseMultipliers.length : 1;

        this.firstPass = new FirstPass(size, this.paralell, this.octaves);
        this.secondPass = new SecondPass(this.octaves, properties);
        this.bumpmapPass = new BumpmapPass(properties);

        this.generateTextures = generateTextures;
        this.createRenderTarget = createRenderTarget;
        this.clone = function() { return this; }

        function generateTextures(parametersArray) {

            var paramCopy = parametersArray.slice();

            do {

                var part = paramCopy.splice(0, this.paralell);

                var count = part.length;

                //renderTarget for first pass
                var sourceTex = createRenderTarget(

                    this.size * this.octaves,
                    this.size * count

                );

                //generate all octaves of all requested heightmaps in one render call
                this.firstPass.makePass(part, sourceTex);

                //merge octaves into final heightmaps
                this.secondPass.makePass(part, sourceTex);

                //generate normals from heightmaps
                this.bumpmapPass.makePass(part);

                //dispose render target
                sourceTex.dispose();

            } while (paramCopy.length > 0);

        }

        function createRenderTarget(width, height) {

            width = width || size;
            height = height || width;

            var settings = {

                minFilter: THREE.LinearFilter,
                magFilter: THREE.NearestFilter,
                generateMipmaps: false,
                format: THREE.RGBAFormat,

            };

            return new THREE.WebGLRenderTarget(width, height, settings);

        }

    };

});


