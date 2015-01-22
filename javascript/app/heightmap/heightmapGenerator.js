define(["three", "renderer", "resources", "config", "heightmap/firstPass", "heightmap/secondPass"],
       function(THREE, renderer, resources, config, FirstPass, SecondPass) {

    return HeightmapGenerator;

    function HeightmapGenerator(size, properties) {

        this.name = properties.name;
        this.size = size;
        this.paralell = config.config.heightmapGenerator.generatorParallelity;
        this.octaves = properties.noiseMultipliers ? properties.noiseMultipliers.length : 1;

        this.firstPass = new FirstPass(size, this.paralell, this.octaves);
        this.secondPass = new SecondPass(this.octaves, properties);

        this.generateTextures = generateTextures;
        this.createRenderTarget = createRenderTarget;
        this.clone = function() { return this; }

        function generateTextures(parametersArray) {

            var paramCopy = parametersArray.slice();
            var clock = new THREE.Clock();

            do {

                var part = paramCopy.splice(0, this.paralell);

                var count = part.length;

                clock.getDelta();

                var sourceTex = createRenderTarget(

                    this.size * this.octaves,
                    this.size * count

                );

                this.firstPass.makePass(part, sourceTex);
                this.secondPass.makePass(part, sourceTex);

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


